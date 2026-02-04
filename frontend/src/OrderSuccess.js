import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId; 
    
    const [queuePosition, setQueuePosition] = useState('...');
    const [status, setStatus] = useState('Processing');

    useEffect(() => {
        if (!orderId) return;

        const fetchLiveStatus = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/order-status/${orderId}`);
                
                setStatus(res.data.status);
                // Position logic including the +1 adjustment we made earlier
                setQueuePosition(res.data.status === 'Delivered' ? 0 : res.data.queuePosition);
            } catch (err) {
                console.error("Status fetch failed", err);
            }
        };

        fetchLiveStatus();
        const interval = setInterval(fetchLiveStatus, 5000); 
        return () => clearInterval(interval);
    }, [orderId]);

    if (!orderId) {
        return <div style={containerStyle}><h2>No Order Found.</h2></div>;
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{...checkCircle, background: status === 'Delivered' ? '#2ed573' : '#ff4757'}}>
                    {status === 'Delivered' ? '✔' : '🔥'}
                </div>
                <h1 style={headerStyle}>Order #{orderId}</h1>
                <p style={subTextStyle}>Your meal is being handled with care.</p>

                <div style={statusGrid}>
                    <div style={statusItem}>
                        <span style={statusLabel}>Queue Status</span>
                        <span style={statusValue}>
                            {status === 'Delivered' ? 'Ready!' : `#${queuePosition} in line`}
                        </span>
                    </div>
                    <div style={statusItem}>
                        <span style={statusLabel}>Kitchen Status</span>
                        <span style={statusValue}>{status}</span>
                    </div>
                </div>

                {/* ❌ Progress bar line has been removed from here */}

                <div style={buttonGroup}>
                    <Link to="/" style={homeLink}>Return to Dashboard</Link>
                 {status !== 'Delivered' && (
    <Link to="/game" style={gameBtn}>Play "Food Catch" While Waiting 🎮</Link>
)}
                </div>
            </div>
        </div>
    );
}

// --- STYLES ---
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa', padding: '20px' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '480px', width: '100%' };
const checkCircle = { width: '70px', height: '70px', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', margin: '0 auto 20px auto' };
const headerStyle = { color: '#2d3436', marginBottom: '10px' };
const subTextStyle = { color: '#636e72', marginBottom: '30px' };
const statusGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', background: '#f1f2f6', padding: '15px', borderRadius: '12px' };
const statusItem = { display: 'flex', flexDirection: 'column' };
const statusLabel = { fontSize: '12px', color: '#b2bec3', textTransform: 'uppercase', fontWeight: 'bold' };
const statusValue = { fontSize: '16px', color: '#2d3436', fontWeight: 'bold' };
const buttonGroup = { display: 'flex', flexDirection: 'column', gap: '15px' };
const homeLink = { textDecoration: 'none', color: '#636e72', fontSize: '14px', fontWeight: 'bold' };
const gameBtn = { textDecoration: 'none', background: '#2d3436', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold' };

export default OrderSuccess;