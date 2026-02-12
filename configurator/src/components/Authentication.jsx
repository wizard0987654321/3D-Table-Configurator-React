import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page refresh
        setError(''); // Clear previous errors

        // ternary operator to choose endpoint based on mode
        const endpoint = isRegistering ? '/api/register' : '/api/login';
        const url = `http://localhost:3000${endpoint}`;

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
        }
    };

    // JSX for the component
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Welcome to the Configurator</h1>
                <h3 className="auth-subtitle">{isRegistering ? 'Create Account' : 'Login'}</h3>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <input 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="auth-input"
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="auth-button">
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <p className="auth-toggle-text">
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <span 
                        onClick={() => setIsRegistering(!isRegistering)} 
                        className="auth-toggle-link"
                    >
                        {isRegistering ? 'Login here' : 'Register here'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Authentication;