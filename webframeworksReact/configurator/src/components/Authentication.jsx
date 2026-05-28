import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLoadingInfo from './AuthLoadingInfo';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Authentication() {

    // to change route
    const navigate = useNavigate();
    
    // state for input fields
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // state that controlls whether login or register field is showed
    const [isRegistering, setIsRegistering] = useState(false);
    
    // state for error messages to show them dynamically
    const [error, setError] = useState('');

    // state for loading indicator
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page refresh
        if (isLoading) return;
        setError(''); // Clear previous errors
        setIsLoading(true);

        // ternary operator to choose endpoint based on mode
        const endpoint = isRegistering ? '/api/register' : '/api/login';
        const url = `${apiBase}${endpoint}`;

        // for both, register and login, send username and password as a request
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If server sent an error (like "User already exists")
                throw new Error(data.error || 'Something went wrong, user already exists.');
            }

            // if response is ok, check if registering or logging in
            if (isRegistering) {
                alert("Registration successful! Please log in.");
                setIsRegistering(false); // switch to login mode
            } else {
                // Login successful
                console.log("Logged in user:", data.user);
                
                // saving in localstorage so after refresh page is not lost immediately
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                
                navigate('/design');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLinkClassName = isLoading
        ? 'auth-toggle-link auth-toggle-link--disabled'
        : 'auth-toggle-link';

    // JSX for the component
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Willkommen beim Konfigurator</h1>
                <h3 className="auth-subtitle">{isRegistering ? 'Konto erstellen' : 'Anmelden'}</h3>
                
                <form onSubmit={handleSubmit} className="auth-form" aria-busy={isLoading}>
                    <input 
                        type="text" 
                        placeholder="Benutzername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                        className="auth-input"
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Passwort" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="auth-input"
                    />

                    {error && <div className="auth-error">{error}</div>}

                    {isLoading && <AuthLoadingInfo />}

                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isRegistering ? 'Registrieren' : 'Anmelden'}
                    </button>
                </form>

                <p className="auth-toggle-text">
                    {isRegistering ? "Schon ein Konto? " : "Noch kein Konto? "}
                    <span 
                        onClick={() => {
                            if (!isLoading) {
                                setIsRegistering(!isRegistering);
                            }
                        }} 
                        className={toggleLinkClassName}
                        aria-disabled={isLoading}
                    >
                        {isRegistering ? 'Hier anmelden' : 'Hier registrieren'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Authentication;