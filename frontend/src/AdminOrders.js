import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        const res = await axios.get('http://localhost:5000/api/admin/all-orders');
        setOrders(res.data);
    };

    const updateStatus = async (id, status) => {
        await axios.put(`http://localhost:5000/api/admin/update-status/${id}`, { newStatus: status });
        loadOrders(); // Refresh table
    };
    

    useEffect(() => { loadOrders(); }, []);

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ color: '#2d3436' }}>📋 Master Order Log</h2>
            <table style={fullTableStyle}>
                <thead>
                    <tr style={{ background: '#ff4757', color: 'white' }}>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Order Details</th>
                        <th>Total</th>
                        <th>Current Status</th>
                        <th>Change Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td>#{o.id}</td>
                            <td style={{ fontWeight: 'bold' }}>{o.customer_name}</td>
                            <td>{o.user_email}</td>
                            <td>
                                {o.items.map((item, idx) => (
                                    <div key={idx} style={{ fontSize: '13px' }}>
                                        • {item.name} (x{item.quantity})
                                    </div>
                                ))}
                            </td>
                            <td>₹{o.total_amount}</td>
                            <td>
                                <span style={statusBadge(o.status)}>{o.status}</span>
                            </td>
                            <td>
                                <button onClick={() => updateStatus(o.id, 'Preparing')} style={btnPrep}>Prepare</button>
                                <button onClick={() => updateStatus(o.id, 'Delivered')} style={btnDone}>Deliver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Styles ---
const fullTableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const statusBadge = (s) => ({ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: s === 'Delivered' ? '#2ecc71' : '#f1c40f', color: 'white' });
const btnPrep = { background: '#f39c12', color: 'white', border: 'none', padding: '5px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' };
const btnDone = { background: '#27ae60', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius: '4px' };

export default AdminOrders;