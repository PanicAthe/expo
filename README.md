
# Walk Tracker App

이 프로젝트는 사용자가 출발/도착 위치를 설정하고, 이동 거리 및 절감한 CO₂를 계산하는 앱입니다.  
백엔드는 **Spring Boot**, 프론트엔드는 **React Native(Expo)**로 구성되어 있습니다.

---

## 📂 프로젝트 구조
```

walk-server/
├── server/       # Spring Boot 서버
├── walk-expo/    # React Native (Expo) 앱
└── README.md

````

---

## 🚀 실행 방법

### 1. 백엔드(Spring Boot)
#### 필수 요구사항
- Java 17+
- Gradle (Wrapper 사용 가능)
- H2 Database (기본 메모리 모드)

#### 실행
```bash
cd server
./gradlew bootRun   # Linux/Mac
gradlew.bat bootRun # Windows
````

서버 기본 URL:

```
http://localhost:8080
```

H2 콘솔:

```
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:testdb
```

---

### 2. 프론트엔드(Expo 앱)

#### 필수 요구사항

* Node.js LTS
* npm 또는 yarn
* Expo CLI

#### 설치 및 실행

```bash
cd walk-expo
npm install
npx expo start
```

QR 코드를 **Expo Go 앱**(안드로이드/iOS)으로 스캔해서 실행할 수 있습니다.

---

## 🔧 환경 변수

프론트엔드와 백엔드 연동 시, API 서버 주소를 Expo 앱에서 수정해야 합니다.
`walk-expo/app/config.js` 또는 환경 변수 파일 `.env`에 서버 URL을 저장해 사용합니다.

예시:

```javascript
export const API_BASE_URL = "https://<your-ngrok-url>.ngrok-free.app";
```

---

## 📌 주요 기능

* 현재 위치 가져오기
* 도착지 설정
* 이동 거리 계산
* 절감된 CO₂ 양 계산
* 세션 저장 및 조회
* H2 데이터베이스 관리

---

## ⚠️ 주의사항

* Expo Go에서는 일부 백그라운드 기능이 제한될 수 있습니다.
  실제 배포 전에는 EAS Build 또는 Bare Workflow로 전환해야 합니다.
* ngrok URL은 매 실행마다 변경됩니다.
  프론트엔드 API 주소를 새 ngrok 주소로 업데이트해야 합니다.

