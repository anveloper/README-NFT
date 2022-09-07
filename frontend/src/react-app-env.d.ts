/// <reference types="react-scripts" />

// .env 활용 시 환경변수의 타입도 선언해준다.
declare namespace NodeJS{
  interface ProcessEnv{
    NODE_ENV: 'development' | 'production';
    REACT_APP_API_BASE_URL: string;
    // REACT_APP_..._KEY: string;
  }
}