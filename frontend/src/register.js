import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added for navigation

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Using axios as you did, which is great for automatic JSON handling
            const response = await axios.post('http://localhost:5000/register', formData);
            
            if (response.status === 200 || response.status === 201) {
                alert("Registered successfully! Now please login.");
                navigate('/login'); // Better than a manual alert
            }
        } catch (err) { 
            console.error("Registration error:", err.response?.data || err.message);
            alert("Error registering: " + (err.response?.data?.error || "Server error")); 
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formCard}>
                <h2 style={{ color: '#ff4757' }}>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        style={inputStyle}
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                    /><br/>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        style={inputStyle}
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    /><br/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        style={inputStyle}
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        required 
                    /><br/>
                    <select 
                        style={inputStyle}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="user">I am a Customer</option>
                        <option value="admin">I am an Admin</option>
                    </select><br/>
                    <button type="submit" style={btnStyle}>Register</button>
                </form>
            </div>
        </div>
    );
}

// --- Basic Styles for Clarity ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: '#f1f2f6' };
const formCard = { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' };
const btnStyle = { width: '100%', padding: '10px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default Register;