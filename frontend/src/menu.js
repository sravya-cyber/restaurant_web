import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const manualDishes = [
    { id: 1, name: 'Hyderabadi Chicken Biryani', price: 280, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0' },
    { id: 2, name: 'Paneer Tikka Biryani', price: 220, category: 'Biryani', image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088' },
    { id: 3, name: 'Margherita Magic', price: 199, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
    { id: 4, name: 'Chicken Dominator', price: 450, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38' },
    { id: 5, name: 'Cheese Lava Burger', price: 160, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
    { id: 6, name: 'Crispy Chicken Burger', price: 180, category: 'Burger', image: 'https://images.unsplash.com/photo-1571091723267-3df2821c5003' },
    { id: 7, name: 'Masala Dosa', price: 110, category: 'South Indian', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee597a' },
    { id: 8, name: 'Idli Sambhar', price: 60, category: 'South Indian', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc' }
];

function Menu() {
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState([]);
    const [showSummary, setShowSummary] = useState(false); 
    const navigate = useNavigate();

    const addToCart = (dish) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === dish.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...dish, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === id);
            if (existingItem?.quantity > 1) {
                return prevCart.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prevCart.filter(item => item.id !== id);
        });
    };

    const clearFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    };

    // --- UPDATED FINAL ORDER LOGIC ---
    const confirmFinalOrder = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.email) {
            alert("Login session expired. Please login again.");
            return;
        }

        const orderData = {
            email: user.email,
            items: cart,
            total: calculateTotal()
        };

        try {
            // Using axios consistently
            const response = await axios.post('http://localhost:5000/api/place-order', orderData);

            if (response.data.success) {
                const newId = response.data.order.id;
                setCart([]);
                setShowSummary(false);
                
                // 🚀 PASSING DATA PROPERLY: This fixes the blank page
                navigate('/order-success', { state: { orderId: newId } });
            }
        } catch (error) {
            console.error("Order Error:", error);
            alert("Order Failed. Please check if server is running.");
        }
    };

    const filteredDishes = category === 'All' 
        ? manualDishes 
        : manualDishes.filter(item => item.category === category);

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Our Signature Menu</h1>

            <div style={tabContainer}>
                {['All', 'Biryani', 'Pizza', 'Burger', 'South Indian'].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)} style={category === cat ? activeTab : inactiveTab}>
                        {cat}
                    </button>
                ))}
            </div>

            <div style={menuGrid}>
                {filteredDishes.map(item => {
                    const cartItem = cart.find(i => i.id === item.id);
                    return (
                        <div key={item.id} style={cardStyle}>
                            <div style={imageWrapper}>
                                <img src={item.image} alt={item.name} style={foodImage} />
                                <div style={priceBadge}>₹{item.price}</div>
                            </div>
                            <div style={infoSection}>
                                <h3 style={foodTitle}>{item.name}</h3>
                                <p style={foodCategory}>{item.category}</p>
                                {cartItem ? (
                                    <div style={qtyContainer}>
                                        <button onClick={() => removeFromCart(item.id)} style={qtyBtn}>-</button>
                                        <span style={qtyText}>{cartItem.quantity}</span>
                                        <button onClick={() => addToCart(item)} style={qtyBtn}>+</button>
                                    </div>
                                ) : (
                                    <button onClick={() => addToCart(item)} style={addBtn}>Add to Cart</button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {cart.length > 0 && !showSummary && (
                <div style={cartContainer}>
                    <div style={cartContent}>
                        <div style={{textAlign: 'left'}}>
                            <h3 style={{margin: 0}}>Total: ₹{calculateTotal()}</h3>
                            <p style={{margin: 0, fontSize: '12px'}}>{cart.length} items selected</p>
                        </div>
                        <button onClick={() => setShowSummary(true)} style={checkoutBtn}>Review Order</button>
                    </div>
                </div>
            )}

            {showSummary && (
                <div style={modalOverlay}>
                    <div style={summaryCard}>
                        <h2>Review Your Order 📋</h2>
                        <div style={itemList}>
                            {cart.map(item => (
                                <div key={item.id} style={summaryItem}>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <div style={{fontSize: '12px', color: '#777'}}>₹{item.price} x {item.quantity}</div>
                                    </div>
                                    <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                                        <span>₹{item.price * item.quantity}</span>
                                        <button onClick={() => clearFromCart(item.id)} style={deleteBtn}>🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={summaryTotal}>
                            <span>Total Payable:</span>
                            <span>₹{calculateTotal()}</span>
                        </div>
                        <div style={modalButtons}>
                            <button onClick={() => setShowSummary(false)} style={backBtn}>Add More</button>
                            <button onClick={confirmFinalOrder} style={confirmBtn}>Place Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- STYLES ---
const containerStyle = { padding: '40px 5%', background: '#fcfcfc', minHeight: '100vh', paddingBottom: '120px' };
const titleStyle = { textAlign: 'center', marginBottom: '30px', color: '#2d3436' };
const tabContainer = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px' };
const inactiveTab = { padding: '8px 20px', borderRadius: '30px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
const activeTab = { ...inactiveTab, background: '#ff4757', color: '#fff', border: 'none' };
const menuGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' };
const cardStyle = { background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', border: '1px solid #eee' };
const imageWrapper = { position: 'relative', height: '200px', width: '100%' };
const foodImage = { width: '100%', height: '100%', objectFit: 'cover' };
const priceBadge = { position: 'absolute', top: '15px', right: '15px', background: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' };
const infoSection = { padding: '20px' };
const foodTitle = { margin: '0 0 5px 0', fontSize: '20px' };
const foodCategory = { color: '#999', fontSize: '14px', marginBottom: '15px' };
const addBtn = { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#ff4757', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };
const qtyContainer = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f2f6', borderRadius: '8px', padding: '5px' };
const qtyBtn = { background: '#ff4757', color: 'white', border: 'none', borderRadius: '5px', width: '35px', height: '35px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' };
const qtyText = { fontWeight: 'bold', fontSize: '16px' };
const cartContainer = { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '600px', zIndex: 1000 };
const cartContent = { background: '#2d3436', color: 'white', padding: '15px 25px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' };
const checkoutBtn = { background: '#2ed573', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const summaryCard = { background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' };
const itemList = { margin: '20px 0', textAlign: 'left' };
const summaryItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' };
const deleteBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' };
const summaryTotal = { display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', margin: '20px 0', color: '#2d3436' };
const modalButtons = { display: 'flex', gap: '15px' };
const backBtn = { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' };
const confirmBtn = { flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#2ed573', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default Menu;