import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StockData() {
    const [stockData, setStockData] = useState([]);

    // 나스닥 상위 주식 데이터 가져오기
    const fetchNasdaqTopData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/nasdaq-top');
            setStockData(response.data);
        } catch (error) {
            console.error("주식 데이터를 가져오는 중 오류 발생:", error);
        }
    };

    // 주식 데이터 저장
    const saveStock = async (stock) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/save-stock', stock, {
                headers: { Authorization: token }
            });
            alert("주식 데이터 저장 성공");
        } catch (error) {
            console.error("주식 데이터 저장 중 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchNasdaqTopData();
    }, []);

    return (
        <div>
            <h2>나스닥 상위 주식 목록</h2>
            {stockData.map((item, index) => (
                <div key={index}>
                    <p><strong>종목 코드:</strong> {item.symbol}</p>
                    <p><strong>현재가:</strong> ${item.currentPrice}</p>
                    <p><strong>고가:</strong> ${item.highPrice}</p>
                    <p><strong>저가:</strong> ${item.lowPrice}</p>
                    <p><strong>시가:</strong> ${item.openPrice}</p>
                    <button onClick={() => saveStock(item)}>저장</button>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default StockData;
