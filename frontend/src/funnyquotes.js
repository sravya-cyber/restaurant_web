import React, { useState, useEffect } from 'react';

const quotes = [
    "In pizza we crust. 🍕",
    "Carbs are my love language. 🥖",
    "Will work for tacos. 🌮",
    "Extra fries, not exercise. 🍟",
    "Hakuna Frittata. 🍳",
    "Keep calm and eat on. 🍔",
    "Don't be upsetti, eat spaghetti. 🍝",
    "Sweet dreams are made of cheese. 🧀",
    "Life happens, coffee helps. ☕",
    "Stay hydrated, eat watermelon. 🍉"
];

function FunnyQuotes() {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        // Picks a random short quote on every page load
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <div style={bannerStyle}>
            <p style={textStyle}>{quote}</p>
        </div>
    );
}

// --- STYLES (Modern & Minimalist) ---
const bannerStyle = {
    backgroundColor: '#fff', 
    padding: '12px 0',
    textAlign: 'center',
    borderBottom: '1px solid #f0f0f0',
    width: '100%'
};

const textStyle = {
    margin: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: '#ff4757', // Matching your QuickBite brand color
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontFamily: 'sans-serif'
};

export default FunnyQuotes;