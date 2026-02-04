import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

   const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // data.user now contains the REAL name from PostgreSQL
            // as long as your server.js sends it back!
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            window.location.href = "/"; 
        } else {
            alert(data || "Login failed. Check your credentials.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Cannot connect to server. Is your backend running?");
    }
};

    return (
        <div style={loginContainer}>
            <form style={loginForm} onSubmit={handleLogin}>
                <h2 style={{ color: '#ff4757', marginBottom: '20px' }}>Welcome Back</h2>
                
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required 
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    required 
                />

                <button type="submit" style={loginBtn}>Login to QuickBite</button>
                
                <p style={{ marginTop: '15px', fontSize: '14px' }}>
                    Don't have an account? <a href="/register" style={{ color: '#ff4757' }}>Join Now</a>
                </p>
            </form>
        </div>
    );
}

// --- STYLES ---
const loginContainer = {
    height: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f1f2f6'
};

const loginForm = {
    background: '#fff',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '350px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box'
};

const loginBtn = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: '#ff4757',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer'
};

export default Login;