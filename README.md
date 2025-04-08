# HitProblem

HitProblem은 TypeScript + Vite + Ant Design을 사용한 프론트엔드와 Express.js 기반의 백엔드로 구성된 프로젝트입니다.
로그인/회원가입 기능 및 주어진 문제에 따른 답안을 작성할 수 있는 기능 제공 및 통계, 내역 조회를 목표로 구현중에 있습니다.

[![프리뷰 영상]](https://youtu.be/m3LE12SQr7s)


## 기술 스택

### Frontend

- TypeScript
- Vite
- Ant Design

### Backend

- Node.js
- Express.js

### DB

- MariaDB

## 설치 방법

프로젝트를 클론한 후, 다음 명령어를 실행하여 필요한 패키지를 설치합니다.

```sh
# 프론트엔드 패키지 설치
cd client
npm install

# 백엔드 패키지 설치
cd ../server
npm install
```

## 실행 방법

### 백엔드 서버 실행

```sh
# nodemon을 사용한 서버 실행 (개발 환경 권장)
npx nodemon server.js
nodemon server.js       #전역으로 이미 설치했을 경우

# 일반적인 서버 실행
node server.js
```

### 프론트엔드 실행

```sh
cd client
npm run dev
```

## 환경 변수 설정 (.env 파일)

다음은 `.env` 파일에서 설정할 수 있는 환경 변수 예시입니다.

```
# 서버 포트 설정
PORT=5000

# 데이터베이스 설정 (예: MongoDB)
DB_HOST=localhost
DB_PORT=27017
DB_NAME=hitproblem
DB_USER=root
DB_PASS=yourpassword

# JWT 시크릿 키
JWT_SECRET=your_jwt_secret_key

# CORS 설정
CORS_ORIGIN=http://localhost:5173
```

`.env` 파일을 프로젝트 루트 디렉토리에 생성한 후, 필요한 값들을 채워넣으세요.

## 기타

- 개발 환경에서는 `nodemon`을 사용하여 변경 사항을 자동 반영할 수 있습니다.
- `CORS_ORIGIN` 값을 필요에 맞게 변경하여 CORS 정책을 설정하세요.

---

이 프로젝트에 대한 문의는 [이슈 트래커](https://github.com/lim-choice/hitproblem/issues)를 이용해주세요.
