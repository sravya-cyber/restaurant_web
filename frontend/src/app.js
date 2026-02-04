import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Menu from './menu';
import FunnyQuotes from './funnyquotes';
import OrderSuccess from './OrderSuccess'; // FIX: Ensure this matches the filename
import MyOrders from './MyOrders'; 
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders'
import FoodGame from './FoodGame';
function App() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
   
      <nav style={navStyle}>
        <div style={logoStyle}>QuickBite 🍔</div>
        <div style={linkContainer}>
          {/* <Link to="/" style={linkStyle}>Home</Link> */}
          
          {!user ? (
            <>
              <Link to="/" style={linkStyle}>Home</Link>
              <Link to="/login" style={linkStyle}>Login</Link>
              <Link to="/register" style={registerBtn}>Join Now</Link>
            </>
          ) : (
            <>
              {user.role !== 'admin' && (
        <>
           <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/menu" style={linkStyle}>Order Food</Link>
          <Link to="/my-orders" style={linkStyle}>My Orders</Link>
          <Link to="/game" style={linkStyle}>Mini Game</Link>
        </>
      )}
             {user.role === 'admin' && (
        <>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/admin-orders" style={linkStyle}>Manage Orders</Link>
          
         
        </>
      )}
              <button 
                onClick={() => { localStorage.clear(); window.location.href = "/"; }} 
                style={logoutBtn}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <FunnyQuotes />
      
      <Routes>
        {/* Main Home Route: Switches between Landing Page and User Dashboard */}
        {/* Public Route */}
  <Route path="/" element={
    !user ? <Home /> : (
      // CHECK ROLE HERE: Redirect based on user type
      user.role === 'admin' ? <AdminDashboard user={user} /> : <UserHome user={user} />
    )
  } />
        
        <Route path="/menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Game Placeholder */}
        
        <Route path="/my-orders" element={<MyOrders />} />
        {/* Success Tracking Route */}
        {/* // Inside Routes in App.js */}
        <Route path="/order-success" element={<OrderSuccess />} />
         <Route path="/admin-orders" element={<AdminOrders />} />
         <Route path="/game" element={<FoodGame />} />
      </Routes>
    </Router>
  );
}

// --- USER HOME COMPONENT (Personalized Dashboard) ---
const UserHome = ({ user }) => (
  <div style={{ padding: '40px 50px' }}>
    <div style={userHero}>
      {/* Updated to check for user and user.name specifically */}
      <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>
        Welcome Back, {user && user.name ? user.name : 'Foodie'}! 👋
      </h1>
      <p style={{ fontSize: '18px', opacity: 0.9 }}>What are we eating today?</p>
      <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
         <Link to="/menu" style={ctaBtn}>Start Ordering</Link>
 
        
       
      </div>
    </div>
  </div>
);

// --- PUBLIC HOME COMPONENT ---
const Home = () => (
  <div>
    <div style={heroSection}>
      <h1 style={heroTitle}>Cravings Delivered to Your Door 🚀</h1>
      <p style={heroSub}>Fresh ingredients, handmade recipes, and lightning-fast delivery.</p>
      <Link to="/menu" style={ctaBtn}>Explore Menu</Link>
    </div>

    <div style={sectionContainer}>
      <h2 style={sectionTitle}>Why Choose QuickBite?</h2>
      <div style={featureGrid}>
        <div style={featureCard}><h3>🌿 Fresh</h3><p>Farm-to-table ingredients daily.</p></div>
        <div style={featureCard}><h3>⚡ Fast</h3><p>Delivered in under 30 minutes.</p></div>
        <div style={featureCard}><h3>👨‍🍳 Quality</h3><p>Prepared by world-class chefs.</p></div>
      </div>
    </div>
  </div>
);

// --- STYLES (All defined here to avoid errors) ---
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' };
const logoStyle = { fontSize: '24px', fontWeight: 'bold', color: '#ff4757' };
const linkContainer = { display: 'flex', alignItems: 'center', gap: '25px' };
const linkStyle = { textDecoration: 'none', color: '#2f3542', fontWeight: '500' };
const registerBtn = { ...linkStyle, background: '#ff4757', color: '#fff', padding: '8px 20px', borderRadius: '20px' };
const logoutBtn = { background: '#2f3542', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' };

const heroSection = {
  height: '70vh',
  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
  background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1350&q=80")',
  backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', textAlign: 'center'
};

const userHero = {
  background: 'linear-gradient(135deg, #ff4757 0%, #ff6b81 100%)',
  padding: '60px', borderRadius: '24px', color: 'white', boxShadow: '0 10px 30px rgba(255, 71, 87, 0.3)', textAlign: 'left'
};

const heroTitle = { fontSize: '56px', marginBottom: '10px' };
const heroSub = { fontSize: '20px', marginBottom: '30px', opacity: '0.9' };
const ctaBtn = { background: '#ff4757', color: '#fff', padding: '15px 40px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' };

const sectionContainer = { padding: '80px 50px', textAlign: 'center' };
const sectionTitle = { fontSize: '32px', marginBottom: '40px' };
const featureGrid = { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' };
const featureCard = { background: '#f1f2f6', padding: '30px', borderRadius: '15px', width: '220px' };

export default App;