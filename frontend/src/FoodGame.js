import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FoodGame() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [items, setItems] = useState([]); 
    const [basketPos, setBasketPos] = useState(50);
    const [gameOver, setGameOver] = useState(false);

    // 🚀 DIFFICULTY SETTINGS
    const isFastMode = score >= 100;
    const fallSpeedBoost = isFastMode ? 2.5 : 1.2; 
    const spawnRate = isFastMode ? 800 : 1200; 

    // 1. Controls (Phone + PC)
    useEffect(() => {
        if (gameOver) return;
        const handleInput = (e) => {
            if (e.key === 'ArrowLeft') setBasketPos(p => Math.max(0, p - 10));
            if (e.key === 'ArrowRight') setBasketPos(p => Math.min(90, p + 10));
        };
        const handleTouch = (e) => {
            const touch = e.touches[0];
            const newPos = (touch.clientX / window.innerWidth) * 100;
            setBasketPos(Math.min(90, Math.max(0, newPos - 5)));
        };
        window.addEventListener('keydown', handleInput);
        window.addEventListener('touchmove', handleTouch);
        return () => {
            window.removeEventListener('keydown', handleInput);
            window.removeEventListener('touchmove', handleTouch);
        };
    }, [gameOver]);

    // 2. Dynamic Spawning & Falling Logic
    useEffect(() => {
        if (gameOver) return;

        const spawnTimer = setInterval(() => {
            const icons = ['🍕', '🍔', '🍟', '🍗'];
            const newItem = {
                id: Math.random(),
                icon: icons[Math.floor(Math.random() * icons.length)],
                left: Math.random() * 85,
                top: 0,
                speed: fallSpeedBoost + Math.random() * 1.0 
            };
            setItems(prev => [...prev, newItem]);
        }, spawnRate); 

        const fallTimer = setInterval(() => {
            setItems(prev => {
                const moved = prev.map(item => ({ ...item, top: item.top + item.speed }));
                
                const groundHits = moved.filter(item => item.top >= 100);
                if (groundHits.length > 0) {
                    setMisses(m => {
                        const newCount = m + groundHits.length;
                        // 🚀 UPDATED: Game Over at 5 misses
                        if (newCount >= 5) setGameOver(true);
                        return newCount;
                    });
                }
                return moved.filter(item => item.top < 100);
            });
        }, 80);

        return () => {
            clearInterval(spawnTimer);
            clearInterval(fallTimer);
        };
    }, [gameOver, isFastMode, fallSpeedBoost, spawnRate]);

    // 3. Catching Logic
    useEffect(() => {
        if (gameOver) return;
        items.forEach(item => {
            if (item.top > 80 && item.top < 95 && Math.abs(item.left - basketPos) < 12) {
                setScore(s => s + 10);
                setItems(prev => prev.filter(i => i.id !== item.id));
            }
        });
    }, [items, basketPos, gameOver]);

    return (
        <div style={bg}>
            <div style={header}>
                <h1 style={{margin: 0, color: isFastMode ? '#ff4757' : 'white'}}>
                    Score: {score} {isFastMode && '⚡'}
                </h1>
                {/* 🚀 UPDATED: UI reflects 5 lives */}
                <h3 style={{color: '#ff4757', margin: '5px 0'}}>Failures: {misses} / 5</h3>
                {isFastMode && <p style={{color: '#ffa502', fontWeight: 'bold'}}>SPEED BOOST ACTIVE!</p>}
            </div>

            <div style={gameCanvas}>
                {items.map(item => (
                    <div key={item.id} style={{ ...itemStyle, top: `${item.top}%`, left: `${item.left}%` }}>
                        {item.icon}
                    </div>
                ))}
                <div style={{ ...basketStyle, left: `${basketPos}%` }}>🧺</div>

                {gameOver && (
                    <div style={overlay}>
                        {/* 🚀 UPDATED: Final Failure Message */}
                        <h2 style={{ color: '#ff4757' }}>YOU HAVE FAILED 5 TIMES! 😵</h2>
                        <p style={{color: '#2d3436'}}>Final Score: {score}</p>
                        <button onClick={() => {setGameOver(false); setScore(0); setMisses(0); setItems([]);}} style={btn}>Restart</button>
                        <button onClick={() => navigate(-1)} style={{...btn, background: '#636e72'}}>Exit</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const bg = { height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#2d3436', color: 'white', touchAction: 'none', overflow: 'hidden' };
const header = { textAlign: 'center', marginBottom: '10px' };
const gameCanvas = { width: '90vw', maxWidth: '350px', height: '60vh', background: '#fff', position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '5px solid #ff4757' };
const itemStyle = { position: 'absolute', fontSize: '30px', transition: 'top 0.08s linear' };
const basketStyle = { position: 'absolute', bottom: '10px', fontSize: '50px', transition: 'left 0.1s ease-out' };
const overlay = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.95)', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, textAlign: 'center', padding: '10px' };
const btn = { padding: '12px 25px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', margin: '5px', fontWeight: 'bold' };

export default FoodGame;