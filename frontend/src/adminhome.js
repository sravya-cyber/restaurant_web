import React from 'react';

function AdminHome() {
    return (
        <div style={{ padding: '20px', color: 'red' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, Owner. Here you can add food and see all orders.</p>
            <div style={{ border: '1px solid black', padding: '10px' }}>
                <h3>Quick Actions</h3>
                <button>Add New Food Item</button>
                <button>View All Orders</button>
            </div>
        </div>
    );
}
export default AdminHome;