const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Ensure your db.js is correctly configured
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json()); // Essential for parsing the order items

const JWT_SECRET = "my_secret_key_123";

// --- MIDDLEWARE: AUTHENTICATION ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json("Access Denied");

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json("Invalid Token");
    }
};

// --- AUTH ROUTES (Admin & User) ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        let query = '';
        
        // FIX: Added .toLowerCase() to handle the lowercase 'admin' from your React form
        if (role && role.toLowerCase() === 'admin') {
            console.log("Adding to ADMINS table");
            query = 'INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        } else {
            console.log("Adding to USERS table");
            query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
        }

        const result = await pool.query(query, [name, email, hashedPassword, role]);
        res.json({ message: "Registered successfully", user: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. First, search in the users table
        let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        // 2. If not found in users, search in the admins table
        if (result.rows.length === 0) {
            result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        }

        // 3. If still not found, then return the error
        if (result.rows.length === 0) {
            return res.status(400).json("Account not found");
        }

        const foundUser = result.rows[0];

        // 4. Compare the password with the hashed version in the DB
        const validPass = await bcrypt.compare(password, foundUser.password);
        if (!validPass) return res.status(400).json("Wrong password");

        // 5. Create a token that includes the REAL role (user or admin)
        const token = jwt.sign(
            { id: foundUser.id, role: foundUser.role }, 
            JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({ 
            token, 
            user: { 
                name: foundUser.name, 
                email: foundUser.email, 
                role: foundUser.role 
            } 
        });

    } catch (err) {
        console.error("Login logic error:", err);
        res.status(500).json("Server error during login");
    }
});

// --- ORDERING ROUTE ---

app.post('/api/place-order', async (req, res) => {
    const { email, items, total } = req.body;

    // Validate that data exists before hitting the DB
    if (!email || !items || !total) {
        return res.status(400).json({ success: false, message: "Missing order details" });
    }

    try {
        // items must be stringified to fit in a JSONB or TEXT column
        const query = "INSERT INTO orders (user_email, items, total_amount) VALUES ($1, $2, $3) RETURNING *";
        const values = [email, JSON.stringify(items), total];
        
        const result = await pool.query(query, values);
        
        res.status(200).json({ success: true, order: result.rows[0] });
    } catch (err) {
        console.error("Database error during order:", err);
        res.status(500).json({ success: false, message: "Database insertion failed" });
    }
});
// Get order history for a specific user
app.get('/api/my-orders/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC",
            [email]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json("Could not retrieve orders");
    }
});
// Get ALL orders for the Admin Panel
app.get('/api/admin/orders', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error("Admin fetch error:", err);
        res.status(500).json("Could not retrieve all orders");
    }
});
// This route is for the Admin to see EVERYONE'S orders
app.get('/api/admin/all-orders', async (req, res) => {
    try {
        const query = `
            SELECT 
                orders.id, 
                users.name as customer_name, 
                orders.user_email, 
                orders.items, 
                orders.total_amount, 
                orders.status, 
                orders.created_at
            FROM orders
            JOIN users ON orders.user_email = users.email
            WHERE orders.status != 'Delivered'  -- 🚀 THIS IS THE KEY FILTER
            ORDER BY orders.created_at DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json("Could not fetch active orders");
    }
});
// Update order status (e.g., from 'Pending' to 'Delivered')
app.put('/api/admin/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
        res.json({ message: "Status updated successfully" });
    } catch (err) {
        res.status(500).json("Update failed");
    }
});
// Route to update order status
app.put('/api/admin/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body; // e.g., "Delivered" or "Preparing"

    try {
        const result = await pool.query(
            "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
            [newStatus, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json("Order not found");
        }

        res.json({ message: "Status updated!", order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json("Database update failed");
    }
});
// Get the current queue position for a specific order
app.get('/api/order-queue/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Get the creation time of the specific order
        const currentOrder = await pool.query("SELECT created_at FROM orders WHERE id = $1", [orderId]);
        if (currentOrder.rows.length === 0) return res.status(404).json("Order not found");
        
        const orderTime = currentOrder.rows[0].created_at;

        // 2. Count how many 'Pending' or 'Preparing' orders were created BEFORE this one
        const queueCount = await pool.query(
            "SELECT COUNT(*) FROM orders WHERE (status = 'Pending' OR status = 'Preparing') AND created_at <= $1",
            [orderTime]
        );

        res.json({ position: parseInt(queueCount.rows[0].count) });
    } catch (err) {
        res.status(500).json("Error calculating queue");
    }
});
app.get('/api/order-status/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get the current order details
        const orderResult = await pool.query("SELECT status, created_at FROM orders WHERE id = $1", [id]);
        if (orderResult.rows.length === 0) return res.status(404).json("Order not found");
        
        const { status, created_at } = orderResult.rows[0];

        // 2. Count orders that were created BEFORE this one and are NOT Delivered
        const queueResult = await pool.query(
            "SELECT COUNT(*) FROM orders WHERE status != 'Delivered' AND created_at < $1",
            [created_at]
        );

        // 🚀 THE FIX: Add + 1 so that the count becomes the user's "Position"
        // If 3 people are in front, (3 + 1) makes you #4 in line.
        const position = parseInt(queueResult.rows[0].count) ;

        res.json({
            status: status,
            queuePosition: position
        });
    } catch (err) {
        res.status(500).json("Error fetching live status");
    }
});
app.get('/api/user-stats/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await pool.query(
            "SELECT COUNT(*) FROM orders WHERE user_email = $1",
            [email]
        );
        res.json({ totalOrders: parseInt(result.rows[0].count) });
    } catch (err) {
        res.status(500).json("Error fetching user stats");
    }
});
app.listen(5000, () => console.log("Server running on port 5000"));