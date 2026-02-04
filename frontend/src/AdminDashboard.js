import React from 'react';

function AdminDashboard({ user }) {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1 style={{ color: '#ff4757' }}>Admin Control Center 🔐</h1>
            <p>Welcome, {user.name}. You have full access to manage orders.</p>
            
          
          
        </div>
    );
}



export default AdminDashboard;