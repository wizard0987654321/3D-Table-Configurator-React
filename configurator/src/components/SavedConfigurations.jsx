import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

export default function SavedConfigurations() {
    const navigate = useNavigate();
    const loadConfig = useConfiguratorStore((s) => s.loadConfiguration);
    const reset = useConfiguratorStore((s) => s.resetToDefault);

    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!userId) {
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

    function handleEdit(config) {
        loadConfig(config);
        navigate('/design');
    }

    function handleOrder(config) {
        alert(`Bestellung für "${config.config_name}" mit Preis ${config.total_price} € wurde aufgenommen!`);
    }

    async function handleDelete(configId) {
        if (!window.confirm("Möchten Sie diese Konfiguration wirklich löschen?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/delete-config/${configId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setConfigs(configs.filter(c => c.id !== configId));
                alert("Konfiguration erfolgreich gelöscht.");
            } else {
                alert("Fehler - nicht gelöscht");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Fehler - nicht gelöscht");
        }
    } // <-- Added this missing closing brace for handleDelete

    // The return must be outside of all other functions
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <h2>Meine gespeicherten Tische</h2>
                <button onClick={() => { reset(); navigate('/design') }} className="back-btn">
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
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button className="edit-btn" onClick={() => handleEdit(config)}>Edit</button>
                                    <button className="order-btn" onClick={() => handleOrder(config)}>Order</button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(config.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}