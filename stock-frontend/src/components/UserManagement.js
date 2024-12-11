import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null); // 수정할 사용자 정보 저장
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: token }
            });
            setUsers(response.data);

        
        } catch (error) {
            console.error("사용자 목록을 가져오는 중 오류 발생:", error);
        }
    };

    const deleteUser = async (id) => {
        


        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: token }
            });
            fetchUsers(); // 목록 업데이트
        } catch (error) {
            console.error("사용자 삭제 중 오류 발생:", error);
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setUsername(user.username);
        setPassword('');
    };

    const updateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/users/${editUser.id}`, 
            { username, password },
            { headers: { Authorization: token } });
            setEditUser(null); // 편집 모드 종료
            fetchUsers(); // 목록 업데이트
        } catch (error) {
            console.error("사용자 수정 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>사용자 관리</h2>
            {users.map((user) => (
                <div key={user.id}>
                    <p><strong>Username:</strong> {user.username}</p>
                    <button onClick={() => handleEditUser(user)}>수정</button>
                    <button onClick={() => deleteUser(user.id)}>삭제</button>
                </div>
            ))}

            {editUser && (
                <div>
                    <h3>사용자 수정</h3>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                    />
                    <button onClick={updateUser}>저장</button>
                    <button onClick={() => setEditUser(null)}>취소</button>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
