import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const s = useConfiguratorStore();
    const loadConfig = useConfiguratorStore((state) => state.loadConfiguration);
    
    // Original Price from Store
    const basePrice = s.getPrice();

    // Local State for Discount Logic
    const [inputCode, setInputCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [statusMessage, setStatusMessage] = useState(''); 

    // RESTORE DATA ON RELOAD
    useEffect(() => {
        const savedData = localStorage.getItem('checkoutConfig');
        if (savedData) {
            loadConfig(JSON.parse(savedData));
        }
    }, [loadConfig]); 

    // CALCULATE FINAL PRICE (Apply discount if > 0)
    const finalPrice = Math.round(basePrice * (1 - discountPercent / 100));

    // FUNCTION TO CALL BACKEND FOR DISCOUNT
    const handleApplyDiscount = async () => {
        if (!inputCode) return;

        try {
            const response = await fetch('http://localhost:3000/api/validate-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: inputCode })
            });

            const data = await response.json();

            if (response.ok && data.valid) {
                setDiscountPercent(data.percent);
                setStatusMessage(`Success! ${data.percent}% discount applied.`);
            } else {
                setDiscountPercent(0);
                setStatusMessage('Invalid code.');
            }
        } catch (error) {
            console.error("Discount check error:", error);
            setStatusMessage('Error checking code.');
        }
    };

    // --- NEW: FUNCTION TO HANDLE ORDER CLICK ---
    const handleOrder = () => {
        alert("Tisch bestellt");
        // Optional: navigate back to home or design page after alert
        // navigate('/design'); 
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', display: 'flex', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Rubik', sans-serif" }}>
            <div style={{ width: '100%', maxWidth: '700px', background: '#1e293b', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', border: '1px solid #334155' }}>
                
                {/* Header with Title and Price */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '24px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Checkout</h1>
                    
                    <div style={{ textAlign: 'right' }}>
                        {discountPercent > 0 ? (
                            <>
                                <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '10px' }}>
                                    {basePrice} €
                                </span>
                                <span style={{ fontSize: '1.4rem', color: '#4ade80', fontWeight: 'bold' }}>
                                    {finalPrice} €
                                </span>
                            </>
                        ) : (
                            <div style={{ fontSize: '1.4rem', color: '#5b8dd9', fontWeight: 'bold' }}>{basePrice} €</div>
                        )}
                    </div>
                </div>

                <h2 style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '20px' }}>{s.configName || 'Untitled Configuration'}</h2>

                {/* Grid for Configuration Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    {[
                        { l: 'Width', v: `${s.width} cm` },
                        { l: 'Depth', v: `${s.depth} cm` },
                        { l: 'Height', v: `${s.height} cm` },
                        { l: 'Shape', v: s.plateShape },
                        { l: 'Leg Type', v: s.legType },
                        { l: 'Thickness', v: `${s.thicknessCm} cm` },
                        { l: 'Material', v: s.topMaterial },
                        { l: 'Legs', v: s.legMaterial }
                    ].map((item, i) => (
                        <div key={i}>
                            <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{item.l}</span>
                            <p style={{ margin: '4px 0 0', fontSize: '1rem', color: '#e2e8f0' }}>{item.v}</p>
                        </div>
                    ))}
                </div>

                {/* Top Color Preview */}
                <div style={{ marginBottom: '24px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Top Color</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: s.topColor, border: '2px solid #f8fafc' }} />
                        <span style={{ fontSize: '1rem', color: '#e2e8f0', fontWeight: '500' }}>{s.topColor}</span>
                    </div>
                </div>

                {/* Rabatt Code Section */}
                <div style={{ marginBottom: '32px', borderTop: '1px solid #334155', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Rabattcode</span>
                    <input 
                        type="text" 
                        placeholder="Code eingeben"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            background: '#0f172a', 
                            border: '1px solid #334155', 
                            color: '#f8fafc', 
                            fontSize: '0.9rem', 
                            outline: 'none', 
                            boxSizing: 'border-box',
                            fontFamily: "'Rubik', sans-serif"
                        }} 
                    />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button 
                            type="button"
                            onClick={handleApplyDiscount}
                            style={{ 
                                width: 'fit-content',
                                padding: '8px 16px', 
                                borderRadius: '6px', 
                                background: '#334155', 
                                color: '#e2e8f0', 
                                border: 'none', 
                                cursor: 'pointer', 
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                fontFamily: "'Rubik', sans-serif",
                                transition: 'background 0.2s'
                            }}
                        >
                            Rabatt anwenden
                        </button>
                        
                        {/* Status Message Display */}
                        {statusMessage && (
                            <span style={{ 
                                fontSize: '0.9rem', 
                                fontWeight: '500',
                                color: statusMessage.includes('Success') ? '#4ade80' : '#ef4444' 
                            }}>
                                {statusMessage}
                            </span>
                        )}
                    </div>
                </div>

                {/* Final Actions */}
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ flex: 1, padding: '14px', borderRadius: '8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer', fontFamily: "'Rubik', sans-serif" }}>Back</button>
                    
                    {/* ADDED ONCLICK HERE */}
                    <button onClick={handleOrder} style={{ flex: 1, padding: '14px', borderRadius: '8px', background: '#5b8dd9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: "'Rubik', sans-serif" }}>Pay Now</button>
                </div>
            </div>
        </div>
    );
}