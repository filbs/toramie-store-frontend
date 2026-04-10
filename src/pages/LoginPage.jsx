import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const encodedCredentials = btoa(`${username}:${password}`);

        try {
            const response = await
        fetch("http://localhost:8080/api/admin/settings/check", {
            headers: {
                "Authorization": `Basic ${encodedCredentials}`
            }
        });

        if (response.ok) {
            //saving encoded string for other pages to use
            localStorage.setItem("userAuth", encodedCredentials);

            navigate("/admin");

            window.location.reload();
        } else {
            setError("Invalid username or password");
            }
        } catch (err) {
            setError("Cannot connect to the backend.");
        }
    };

    return (
        <div className="login-page">
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginPage;