import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch historical data for the logged-in user
                const response = await fetch(`http://localhost:5000/api/my-orders/${user.email}`);
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            }
        };
        if (user?.email) fetchOrders();
    }, [user?.email]);

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#2d3436' }}>Your Order History 📦</h1>
            <p style={{ color: '#636e72', marginBottom: '20px' }}>Click any order to view live status and queue position.</p>
            
            {orders.length === 0 ? (
                <p>You haven't ordered anything yet. Time to eat!</p>
            ) : (
                orders.map((order) => (
                    // 🚀 Added onClick to navigate to OrderSuccess with state
                    <div 
                        key={order.id} 
                        style={orderCard} 
                        onClick={() => navigate('/order-success', { state: { orderId: order.id } })}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ fontSize: '18px' }}>Order #{order.id}</strong>
                            <span style={statusBadge(order.status)}>{order.status}</span>
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#636e72', margin: '5px 0' }}>
                            {new Date(order.created_at).toLocaleDateString()}
                        </p>
                        
                        <div style={{ margin: '15px 0' }}>
                            {order.items.map((item, index) => (
                                <div key={index} style={{ fontSize: '15px', color: '#2d3436' }}>
                                    • {item.name} x {item.quantity}
                                </div>
                            ))}
                        </div>
                        
                        <h3 style={{ margin: 0, color: '#ff4757' }}>Total: ₹{order.total_amount}</h3>
                    </div>
                ))
            )}
        </div>
    );
}

// --- STYLES ---
const orderCard = { 
    background: '#fff', 
    padding: '25px', 
    borderRadius: '15px', 
    marginBottom: '20px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    border: '1px solid #eee',
    cursor: 'pointer', // 👈 Shows user the card is clickable
    transition: 'transform 0.2s, box-shadow 0.2s',
    // Hover effect is handled by standard CSS usually, but this adds the logic
};

// Dynamic badge color based on status
const statusBadge = (status) => ({ 
    background: status === 'Delivered' ? '#e3fcef' : '#fff9db', 
    color: status === 'Delivered' ? '#00b894' : '#f1c40f', 
    padding: '4px 12px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: 'bold',
    border: status === 'Delivered' ? 'none' : '1px solid #f1c40f'
});

export default MyOrders;