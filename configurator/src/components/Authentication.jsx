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
                setIsRegistering(false); // Switch to login mode
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
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Welcome to the Configurator</h1>
            
            <div style={{ 
                border: '1px solid #ccc', 
                padding: '30px', 
                margin: '20px auto', 
                maxWidth: '350px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3>{isRegistering ? 'Create Account' : 'Login'}</h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <input 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: '10px', fontSize: '16px' }}
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '10px', fontSize: '16px' }}
                    />

                    {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}

                    <button type="submit" style={{ 
                        padding: '10px', 
                        cursor: 'pointer', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}>
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px' }}>
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <span 
                        onClick={() => setIsRegistering(!isRegistering)} 
                        style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isRegistering ? 'Login here' : 'Register here'}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Authentication;