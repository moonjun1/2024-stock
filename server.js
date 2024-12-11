// 필요한 모듈을 불러옵니다.
const express = require('express'); // Express 서버 프레임워크
const mysql = require('mysql2'); // MySQL 연결을 위한 모듈
const cors = require('cors'); // CORS 설정을 위한 모듈
const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위한 모듈
const jwt = require('jsonwebtoken'); // JWT 인증을 위한 모듈
const axios = require('axios'); // 외부 API 호출을 위한 모듈
const rateLimit = require('express-rate-limit'); // 요청 속도 제한을 위한 모듈
const { body, validationResult } = require('express-validator'); // 입력 검증을 위한 모듈
const helmet = require('helmet'); // 보안 설정을 위한 모듈
const morgan = require('morgan'); // HTTP 요청 로깅을 위한 모듈

// 서버 포트와 비밀 키, 외부 API 키 설정
const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key';
const API_KEY = 'csj23e1r01qujq2amffgcsj23e1r01qujq2amfg0';

// 미들웨어 설정
app.use(cors()); // 모든 도메인에서의 요청 허용
app.use(express.json()); // JSON 형식의 요청 본문을 파싱
app.use(helmet()); // 보안 설정 강화
app.use(morgan('combined')); // HTTP 요청 정보를 로깅

// 요청 속도 제한 설정 (1분에 60번 요청 제한)
app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 60, // 최대 100번 요청 허용
    message: "요청이 너무 많습니다. 잠시 후 다시 시도하세요." // 오류 메시지 한글화
}));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myapp'
});

db.connect(err => {
    if (err) console.error('MySQL 연결 오류:', err);
    else console.log('MySQL 연결 성공');
});

// JWT 인증 미들웨어 설정
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer [token]" 형식에서 토큰 부분 추출
    if (!token) return res.status(401).json({ error: '토큰이 필요합니다.' }); // 토큰이 없을 경우 401 Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: '유효하지 않은 토큰입니다.' }); // 토큰 검증 실패 시 403 Forbidden
        req.user = user; // 유효한 토큰일 경우 사용자 정보를 요청에 추가
        next();
    });
};

// 회원가입 엔드포인트 (POST /api/register)
app.post('/api/register', 
    // 입력 검증 설정
    body('username').isLength({ min: 4 }).withMessage('사용자 이름은 최소 4자 이상이어야 합니다.'),
    body('password').isLength({ min: 4 }).withMessage('비밀번호는 최소 4자 이상이어야 합니다.'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해싱
        db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword],
            (err) => {
                if (err) return res.status(500).json({ error: '회원가입 실패' });
                res.json({ message: '회원가입 성공' });
            }
        );
    }
);

// 로그인 엔드포인트 (POST /api/login)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: '잘못된 비밀번호입니다.' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: '로그인 성공', token });
    });
});

// 사용자 목록 조회 엔드포인트 (GET /api/users) - 인증 필요
app.get('/api/users', authenticateToken, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: '사용자 목록 조회 실패' });
        res.json(results);
    });
});

// 사용자 삭제 엔드포인트 (DELETE /api/users/:id) - 인증 필요
app.delete('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: '사용자 삭제 실패' });
        if (result.affectedRows === 0) return res.status(404).json({ error: '사용자를 찾을 수 없음' });
        res.json({ message: '사용자 삭제 성공' });
    });
});

// 나스닥 주식 데이터 조회 엔드포인트 (GET /api/nasdaq-top)
app.get('/api/nasdaq-top', async (req, res) => {
    try {
        const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];
        const responses = await Promise.all(symbols.map(symbol =>
            axios.get(`https://finnhub.io/api/v1/quote`, { params: { symbol, token: API_KEY } })
        ));
        
        const stockData = responses.map((response, index) => ({
            symbol: symbols[index],
            currentPrice: response.data.c,
            highPrice: response.data.h,
            lowPrice: response.data.l,
            openPrice: response.data.o
        }));
        res.json(stockData);
    } catch (error) {
        console.error('주식 데이터 조회 실패:', error);
        res.status(500).json({ error: '주식 데이터 조회 실패' });
    }
});

// 주식 데이터 저장 엔드포인트 (POST /api/save-stock) - 인증 필요
app.post('/api/save-stock', authenticateToken, (req, res) => {
    const { symbol, currentPrice, highPrice, lowPrice, openPrice } = req.body;
    db.query(
        'INSERT INTO saved_stocks (symbol, current_price, high_price, low_price, open_price) VALUES (?, ?, ?, ?, ?)',
        [symbol, currentPrice, highPrice, lowPrice, openPrice],
        (err) => {
            if (err) return res.status(500).json({ error: '주식 데이터 저장 실패' });
            res.json({ message: '주식 데이터가 저장되었습니다.' });
        }
    );
});

// 사용자 정보 수정 엔드포인트 (PUT /api/users/:id) - 인증 필요
app.put('/api/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    const query = password 
        ? 'UPDATE users SET username = ?, password = ? WHERE id = ?' 
        : 'UPDATE users SET username = ? WHERE id = ?';
    const values = password 
        ? [username, bcrypt.hashSync(password, 10), id] 
        : [username, id];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: '사용자 수정 실패' });
        if (result.affectedRows === 0) return res.status(404).json({ error: '사용자를 찾을 수 없음' });
        res.json({ message: '사용자 수정 성공' });
    });
});

// 저장된 주식 목록 조회 엔드포인트 (GET /api/saved-stocks) - 인증 필요
app.get('/api/saved-stocks', authenticateToken, (req, res) => {
    db.query('SELECT * FROM saved_stocks', (err, results) => {
        if (err) return res.status(500).json({ error: '저장된 주식 조회 실패' });
        res.json(results);
    });
});

// 저장된 주식 삭제 엔드포인트 (DELETE /api/saved-stocks/:id) - 인증 필요
app.delete('/api/saved-stocks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM saved_stocks WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: '주식 삭제 실패' });
        if (result.affectedRows === 0) return res.status(404).json({ error: '주식을 찾을 수 없음' });
        res.json({ message: '주식 삭제 성공' });
    });
});

// 서버 시작
app.listen(PORT, () => console.log(`서버가 http://localhost:${PORT} 에서 실행 중`));
