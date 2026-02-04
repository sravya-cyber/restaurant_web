import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileIcon() {
    const [isOpen, setIsOpen] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    
    // Retrieve user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user?.email && isOpen) {
            axios.get(`http://localhost:5000/api/user-stats/${user.email}`)
                .then(res => setOrderCount(res.data.totalOrders))
                .catch(err => console.error(err));
        }
    }, [isOpen, user?.email]);

    if (!user) return null;

    return (
        <div style={container}>
            {/* The Icon */}
            <div style={iconCircle} onClick={() => setIsOpen(!isOpen)}>
                {user.name.charAt(0).toUpperCase()}
            </div>

            {/* The Dropdown Card */}
            {isOpen && (
                <div style={dropdownCard}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
                    <p style={detailText}>{user.email}</p>
                    <hr style={divider} />
                    <div style={statRow}>
                        <span>Total Orders:</span>
                        <span style={countBadge}>{orderCount}</span>
                    </div>
                    <button style={logoutBtn} onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}>Logout</button>
                </div>
            )}
        </div>
    );
}

// --- STYLES ---
const container = { position: 'relative', display: 'inline-block' };
const iconCircle = {
    width: '40px', height: '40px', background: '#ff4757', color: 'white',
    borderRadius: '50%', display: 'flex', justifyContent: 'center',
    alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px'
};
const dropdownCard = {
    position: 'absolute', top: '50px', right: '0', width: '220px',
    background: 'white', padding: '15px', borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', z_index: 1000, textAlign: 'left',
    border: '1px solid #eee'
};
const detailText = { fontSize: '12px', color: '#636e72', margin: '0 0 10px 0' };
const divider = { border: 'none', borderTop: '1px solid #eee', margin: '10px 0' };
const statRow = { display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' };
const countBadge = { background: '#f1f2f6', padding: '2px 8px', borderRadius: '10px' };
const logoutBtn = { 
    marginTop: '15px', width: '100%', padding: '8px', borderRadius: '6px',
    border: '1px solid #ff4757', color: '#ff4757', background: 'none', cursor: 'pointer'
};

export default ProfileIcon;