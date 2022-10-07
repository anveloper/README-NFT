# FE 프로젝트 환경 구성

## React, Typescript, redux(RTK)

**프론트 엔드 환경 세팅**

- CRA redux-typescript 템플릿 사용
    
    ```bash
    $ npx create-react-app frontend --template redux-typescript
    ```
    
    - 사용하지 않는 컴포넌트 정리
    - TDD 고려 jest 사용할 지 토의하기
- Axios, dotenv
    
    ```bash
    $ npm install axios dotenv
    ```
    
- React-router-dom
    
    ```bash
    $ npm install react-router-dom
    ```
    
    ```tsx
    import * as React from "react";
    import ReactDOM from "react-dom/client";
    import { BrowserRouter } from "react-router-dom";
    import "./index.css";
    import App from "./App";
    import reportWebVitals from "./reportWebVitals";
    
    const root = ReactDOM.createRoot(
      document.getElementById("root")
    );
    root.render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
    );
    ```
    
    ```tsx
    import React from 'react';
    import { Routes, Route, Link} from 'react-router-dom'
    
    import Login from './features/auth/Login';
    import { Counter } from './features/counter/Counter';
    function App() {
      return (
        <div className="App">
          <header className="App-header">
            <Link to="/login">로그인</Link>
            <Link to="/counter">카운터</Link>
          </header>
          <Routes>
            <Route path="/login" element={<Login />} />        
            <Route path="/counter" element={<Counter />} />        
          </Routes>
        </div>
      );
    }
    
    export default App;
    ```
    
- react-helmet-async(spa 라우터 이동 시 제목 변경하기 + 검색 정보)
    
    ```tsx
    $ npm install react-helmet-async
    ```
    
    ```tsx
    import { HelmetProvider } from 'react-helmet-async';
    ...
    root.render(
      <HelmetProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </HelmetProvider>
    );
    ```
    
    ```tsx
    import { Helmet } from 'react-helmet-async';
    ...
    		<Helmet>
          <title>{title값}</title>
        </Helmet>
    ```
    
    - 별도의 helmet 컴포넌트 만들기
- lodash: 지연 요청(과도한 요청 방지)
    
    ```tsx
    npm install lodash
    ```
    

## Prettier, Eslint

### Prettier

[Prettier](https://prettier.io/) 코드 포멧터를 프로젝트에서 활용하기 위한 패키지를 설치합니다.

```bash
npm i -D --save-exact prettier
```

**.prettierrc.js**

```jsx
module.exports = {
  // 화살표 함수 식 매개변수 () 생략 여부 (ex: (a) => a)
  arrowParens: 'always',
  // 닫는 괄호(>) 위치 설정
  // ex: <div
  //       id="unique-id"
  //       class="contaienr"
  //     >
  htmlWhitespaceSensitivity: 'css',
  bracketSameLine: false,
  // 객체 표기 괄호 사이 공백 추가 여부 (ex: { foo: bar })
  bracketSpacing: true,
  // 행폭 설정 (줄 길이가 설정 값보다 길어지면 자동 개행)
  printWidth: 80,
  // 산문 래핑 설정
  proseWrap: 'preserve',
  // 객체 속성 key 값에 인용 부호 사용 여부 (ex: { 'key': 'xkieo-xxxx' })
  quoteProps: 'as-needed',
  // 세미콜론(;) 사용 여부
  semi: true,
  // 싱글 인용 부호(') 사용 여부
  singleQuote: true,
  // 탭 너비 설정
  tabWidth: 2,
  // 객체 마지막 속성 선언 뒷 부분에 콤마 추가 여부
  trailingComma: 'es5',
  // 탭 사용 여부
  useTabs: false,
};
```

**.prettierignore**

```jsx
dist
build
coverage
```

### ESLint

[ESLint](https://eslint.org/) 린팅 도구를 프로젝트에 활용하기 위해 설치 및 구성 파일 초기화 명령을 실행합니다.

```bash
npm init @eslint/config
```


    
```tsx
$ npm i -D eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-config-prettier
// typescript 설정항목 선택
// eslint-plugin-prettier 왜 읽을 수 없다고 떴는 지 확인안됨.
```
    

### ESLint + React + Prettier 통합 설정 + Typescript 포함

**.eslintrc.yml**

```yaml
env:
  browser: true
  es2021: true
  node: true
extends:
  - eslint:recommended
  - plugin:react/recommended
  - plugin:react/jsx-runtime
  - plugin:react-hooks/recommended
  - plugin:jsx-a11y/recommended
  - plugin:prettier/recommended
  - prettier
  - standard-with-typescript
overrides: []
parserOptions:
  ecmaFeatures:
    jsx: true
  ecmaVersion: latest
  sourceType: module
plugins:
  - react
  - jsx-a11y
rules: {}
```

### ESLint 린팅 제외 항목 작성

**.eslintignore**

```jsx
dist
build
coverage
```   
