import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SavedStocks() {
    const [savedStocks, setSavedStocks] = useState([]);

    // 저장된 주식 목록 가져오기
    const fetchSavedStocks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/saved-stocks', {
                headers: { Authorization: token }
            });
            setSavedStocks(response.data);
        } catch (error) {
            console.error('저장된 주식 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 주식 삭제 함수
    const deleteStock = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/saved-stocks/${id}`, {
                headers: { Authorization: token }
            });
            fetchSavedStocks(); // 목록 업데이트
        } catch (error) {
            console.error("주식 삭제 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchSavedStocks();
    }, []);

    return (
        <div>
            <h2>저장된 주식 목록</h2>
            {savedStocks.map((stock, index) => (
                <div key={index}>
                    <p><strong>종목:</strong> {stock.symbol}</p>
                    <p><strong>현재가:</strong> ${stock.current_price}</p>
                    <p><strong>고가:</strong> ${stock.high_price}</p>
                    <p><strong>저가:</strong> ${stock.low_price}</p>
                    <p><strong>시가:</strong> ${stock.open_price}</p>
                    <button onClick={() => deleteStock(stock.id)}>삭제</button>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default SavedStocks;
