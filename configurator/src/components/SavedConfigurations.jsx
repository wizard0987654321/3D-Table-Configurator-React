import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SavedConfigurations() {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
            // Redirect to login if not logged in
            navigate('/'); 
            return;
        }

        const fetchConfigs = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/user-configs/${userId}`);
                const data = await response.json();
                setConfigs(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, [userId, navigate]);

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h2>Meine gespeicherten Tische</h2>
                <button onClick={() => navigate('/design')} className="back-btn">
                    + Neuer Tisch
                </button>
            </div>

            {loading ? (
                <p>Lädt...</p>
            ) : configs.length === 0 ? (
                <p>Noch keine Tische gespeichert.</p>
            ) : (
                <div className="config-grid">
                    {configs.map((config) => (
                        <div key={config.id} className="config-card">
                            <div className="card-header">
                                <h4>{config.config_name || "Unbenannter Tisch"}</h4>
                                <span className="price-badge">{config.total_price} €</span>
                            </div>
                            
                            <div className="card-details">
                                <p><strong>Form:</strong> {config.plate_shape === 'rect' ? 'Rechteck' : 'Rund'}</p>
                                <p><strong>Maße:</strong> {config.width}x{config.depth} cm</p>
                                <p className="date">Gespeichert am: {new Date(config.created_at).toLocaleDateString()}</p>
                            </div>

                            <button className="load-btn">Laden</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedConfigurations;