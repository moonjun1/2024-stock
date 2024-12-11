추가해야할 사항

CREATE DATABASE myapp;
USE myapp;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

이랑

CREATE TABLE saved_stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    current_price DECIMAL(10, 2),
    high_price DECIMAL(10, 2),
    low_price DECIMAL(10, 2),
    open_price DECIMAL(10, 2)
);

기존의 데이터베이스 삭제하고 myapp으로 새로 생성

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
사용자 인증, 주식 데이터 조회 및 관리 기능을 제공하는 React와 Node.js 기반 애플리케이션

1. server.js (백엔드 서버)
이 서버는 Express를 이용하여 API를 제공합니다.

주요 기능:
사용자 인증 및 관리:

회원가입: POST /api/register에서 사용자 정보를 등록합니다.
로그인: POST /api/login에서 로그인하여 JWT 토큰을 발급합니다.
사용자 목록 조회: GET /api/users를 통해 사용자 목록을 조회합니다.
사용자 삭제 및 수정: DELETE /api/users/:id와 PUT /api/users/:id로 사용자 정보를 삭제 또는 수정합니다.
주식 데이터:

주식 조회: GET /api/nasdaq-top에서 나스닥 상위 주식 데이터를 조회합니다.
주식 저장 및 삭제: POST /api/save-stock을 통해 주식을 저장하고, DELETE /api/saved-stocks/:id로 저장된 주식을 삭제합니다​.
2. App.js (앱 전체 구성)
앱의 루트 컴포넌트로 인증 상태에 따라 로그인, 회원가입, 주식 데이터 표시, 사용자 관리, 저장된 주식 목록을 보여줍니다.

주요 기능:
로그인 상태 관리: isAuthenticated를 통해 로그인 여부를 판단합니다.
회원가입 및 로그인: 로그인 또는 회원가입 양식을 표시합니다.
로그아웃: handleLogout 함수로 로그아웃하여 JWT 토큰을 제거하고 인증 상태를 해제합니다​.
3. Login.js와 Register.js (인증 컴포넌트)
이 두 컴포넌트는 각각 로그인 및 회원가입 기능을 제공합니다.

주요 기능:
Login.js:

사용자가 입력한 자격 증명으로 로그인 요청을 보냅니다.
로그인 성공 시 JWT 토큰을 localStorage에 저장하고 인증 상태를 업데이트합니다​.
Register.js:

회원가입 정보를 제출하고, 성공 여부에 따라 메시지를 표시합니다​.
4. UserManagement.js (사용자 관리 컴포넌트)
관리자는 사용자 목록을 조회, 수정 및 삭제할 수 있습니다.

주요 기능:
사용자 목록 조회: fetchUsers 함수에서 API를 통해 사용자 목록을 불러옵니다.
사용자 수정: handleEditUser로 사용자를 편집할 수 있으며, updateUser 함수로 수정된 정보를 API에 전송합니다.
사용자 삭제: deleteUser 함수로 선택한 사용자를 삭제합니다​.
5. StockData.js (주식 데이터 조회 및 저장)
나스닥 상위 주식 목록을 조회하고, 개별 주식을 저장할 수 있는 기능을 제공합니다.

주요 기능:
주식 목록 조회: fetchNasdaqTopData 함수로 주식 데이터를 조회합니다.
주식 저장: saveStock 함수를 사용하여 개별 주식을 저장합니다​.
6. SavedStocks.js (저장된 주식 관리)
저장된 주식 목록을 조회, 수정 및 삭제할 수 있습니다.

주요 기능:
저장된 주식 조회: fetchSavedStocks 함수로 저장된 주식 목록을 불러옵니다.
주식 수정 및 삭제: updateStock과 deleteStock 함수로 개별 주식을 수정 및 삭제할 수 있습니다​.
