import React, { useEffect, useState } from 'react';
import Login from './components/Login'; // 로그인 페이지 컴포넌트
import Register from './components/Register'; // 회원가입 페이지 컴포넌트
import StockData from './components/StockData'; // 상위 주식 목록 컴포넌트
import SavedStocks from './components/SavedStocks'; // 저장된 주식 목록 컴포넌트
import UserManagement from './components/UserManagement'; // 사용자 관리 컴포넌트

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 상태 관리

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true); // 토큰이 존재하면 로그인 상태로 설정
        }
    }, []);

    // 로그인 성공 시 호출되는 함수
    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    // 로그아웃 시 호출되는 함수
    const handleLogout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        setIsAuthenticated(false); // 로그인 상태 해제
    };

    return (
        <div>
            <h1>주식 관리 애플리케이션</h1>
            {isAuthenticated ? (
                <div>
                    <button onClick={handleLogout}>로그아웃</button>
                    <StockData /> {/* 상위 주식 목록 */}
                    <SavedStocks /> {/* 저장된 주식 목록 */}
                    <UserManagement /> {/* 사용자 관리 */}
                </div>
            ) : (
                <div>
                    <Login onLogin={handleLogin} /> {/* 로그인 화면 */}
                    <Register /> {/* 회원가입 화면 */}
                    <StockData /> {/* 상위 주식 목록 */}
                </div>
            )}

            
        </div>
    );
}

export default App;
