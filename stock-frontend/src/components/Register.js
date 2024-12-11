import React, { useState } from 'react';
import axios from 'axios';

function Register({ onToggle }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:5000/api/register', { username, password });
            setMessage('회원가입 성공');
        } catch (error) {
            setMessage(error.response?.data?.errors[0]?.msg || '회원가입 실패');
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>회원가입</button>
            <button onClick={onToggle}>로그인</button>
            <p>{message}</p>
        </div>
    );
}

export default Register;
