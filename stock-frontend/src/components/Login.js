import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', `Bearer ${token}`);
            onLogin();
        } catch (error) {
            console.error("로그인 오류:", error);
            setErrorMessage(error.response?.data?.error || '로그인 실패');
        }
    };

    

    return (
        <form onSubmit={handleLogin}>
            <h2>로그인</h2>
            <input
                type="text"
                placeholder="사용자 이름"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">로그인</button>
            {errorMessage && <p>{errorMessage}</p>}
        </form>
    );
}

export default Login;
