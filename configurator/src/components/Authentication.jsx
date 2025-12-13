// src/components/AuthPlaceholder.jsx
import { useNavigate } from 'react-router-dom';

function Authentication() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Later, we will check the database here.
        // For now, just send the user to the configurator.
        navigate('/design');
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Welcome to the Configurator</h1>
            
            <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px auto', maxWidth: '300px' }}>
                <h3>Register / Login Field</h3>
                <p>Please log in to start designing.</p>
                
                <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Enter (Simulate Login)
                </button>
            </div>
        </div>
    );
}

export default Authentication;