# 06_Socket 환경 구성

## 사용 기술 스택

> Node.js, PM2, Socket.io

| Node.js                                                      | PM2                                                          | Socket.io                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image](https://user-images.githubusercontent.com/93081720/191640754-312d2aba-b28e-44fc-b847-e0cb51f61b07.png) | <img src="https://user-images.githubusercontent.com/93081720/191640790-1cfd32d4-7d10-46ca-bd9e-d03ed21691f9.png" referrerpolicy="no-referrer" alt="image" width="400px"> | ![image](https://user-images.githubusercontent.com/93081720/191645162-a8e858fa-e295-49e6-bbc2-ae4c2b694d61.png) |

빌드를 먼저 한 뒤에 해당 빌드 결과를 이미지화해오는 방식으로 구성하였으며, Node.js 환경을 PM2로 구동함

따라서 `ecosystem.config.js`파일을 생성해서 해당 파일을 도커 이미지에서 실행시켜줘야함

<br>

## 소스 코드

### Dockerfile

> Node.js 빌드 환경을 구성한 뒤에 pm2를 컨테이너 전역으로 설치하여 ecosystem.config를 실행함

```dockerfile
FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/socket/

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

FROM node:16.15.0

RUN mkdir /app

WORKDIR /app

RUN mkdir ./dist

RUN ["npm", "install", "pm2", "-g"]

COPY . .

COPY --from=build /jenkins_home/workspace/deployment/socket/dist ./dist

EXPOSE 5000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
```

#### 과정 설명

1. node를 build 환경으로서 불러온다
2.  컨테이너 안에 `/jenkins_home/workspace/deployment/socket`로 워킹 디렉토리를 설정한다
   - 만약 해당 디렉토리가 없다면 docker가 알아서 자동으로 만들어준다
3. Dependency 파일을 로컬에서 컨테이너의 워킹 디렉토리로 복사해온다
   - 에스테릭(*)을 사용해서 여러 파일을 복사해올 때는 워킹 디렉토리를 표현할 때 `.` 으로만 쓰면 안 되고, `./`으로 써야한다.
4. npm install
5. COPY . . 을 통해 현재 로컬에 있는 모든 파일을 복사해온다
6. npm run build를 통해 빌드 결과를 생성함
7. node를 실행 환경으로써 설치함
8. `/app` 폴더를 만들고, 워킹 디렉토리를 `/app`으로 설정함
9. `/app` 아래 `/dist` 파일을 생성
10. pm2를 컨테이너 안에서 전역 환경으로 설치함
11. 로컬에 있는 파일들을 복사해옴
12. 빌드 스테이지에서 빌드한 결과를 `/dist`파일로 복사해옴
13. 포트 번호를 5000번으로 명시(기능적인 효과 없음)
    - ※ EXPOSE는 컨테이너에 포트를 직접 연결해주는 기능을 하지 않고, 연결 포트가 무엇인지 알려주는 명시적인 역할을 할뿐 기능은 없다 => 실제 포트를 연결하는 것은 docker run에서 -p를 통해서 설정하는 것임
14. pm2 환경에서 실행
    - ※ 컨테이너 환경에서 PM2로 실행하려면 `pm2 start <이름> -- run <서버.js 파일명>`으로 실행하면 안 되고, `ecosystem.config.js`를 통해서 실행해야한다

<br>

### ecosystem.config.js

> 각 구성 옵션에 대해서는 공식문서를 참조하는 것을 권장

```javascript
module.exports = [{
  script: 'dist/server.js',
  name: 'npm',
  env_production: {
    NODE_ENV: "production"
  },
}]
```

#### 과정 설명

- script
  - npm run build를  통해서 생성되는 폴더에 있는 `.js`파일의 경로를 작성해줌
- name
  - pm2 환경에서 프로세스(태스크)의 이름

<br>

## PM2 관련 참고 사항

#### 일반 환경에서의 PM2 실행

- pm2 start <이름> -- run <서버.js 파일명>
- 예) `pm2 start npm -- run server`

<br>

#### 컨테이너 환경에서의 PM2 실행

- 컨테이너 환경에서 PM2로 실행환경을 구성하려면 반드시 `ecosystem.config.js`가 있어야한다
  - 그렇지 않으면 PM2 데몬이 실행 이후, 성공이라는 메시지와 함께 바로 꺼져버린다.

- `ecosystem.config.js`에 실행할 서버 파일이나 기타 옵션을 설정하고
- 도커 파일 맨 밑에 `CMD ["pm2-runtime", "start", "ecosystem.config.js"]`을 쓴다
  - 옵션 및 파일 설정을 어떻게 했느냐에 따라 `CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]`으로 쓰기도 함

<br>

#### pm2 실행 상태 조회

- pm2 실행 상태 조회는 일반적인 상태에서는 할 수 없다
- EC2에서 ubuntu 계정으로 접속하여 `pm2 list` 또는 `pm2 status`를 입력
  - `su -`을 입력하고 설정한 비밀번호를 입력하고 우분투 계정으로 접속하여 해당 명령어를 입력(비밀번호 설정을 안 했다면 입력하는 비밀번호가 설정될 비밀번호임)

<br>

#### pm2 죽이기

- 특정 프로세스 죽이기
  - pm2 stop <프로세스 ID>
- pm2 실행 환경 죽이기
  - pm2 kill

<br>

#### 소켓 서버와 프론트 연결(내가 했던 실수와 발견한 점)

- 내가 도커라이징한 결과를 로컬 및 ec2에서 실행했을 때는 우리 배포 페이지와 소켓 통신을 할 때, 웹 콘솔에서 400 bad request를 출력하고 있었다.
  - 간혹 이미지를 다르게 빌드해서 테스트 했을 경우, 컨테이너가 정상적으로 실행되지 않고 종료되었을 때는 502 Bad gateway가 나오는 것을 봄
  - 즉, 잘못된 이미지를 빌드했을 때는 502이지만, 400이 나오는 것으로 보아 실행은 정상적이지만 뭔가 어딘가 잘못됨을 알게됨
- 당시 빌드한 이미지를 컨테이너화하여 도커 로그를 찍어보니 똑같은 메세지가 '두' 번씩 출력되고 있음을 확인
- 그러나 EC2 환경에서 직접 pm2를 실행시켰을 때는 메세지가 1개임을 확인함
  - pm2 log를 찍어서 봤더니 `listening on http://localhost:5000`으로 '하나'의 메세지만 출력하고 있었음 => 우리 배포 페이지와 정상적으로 소켓 통신하고 있음을 확인
  - ec2 자체에서 npm i와 pm2를 설치하고`pm2 start npm --run server`를 입력하면 pm2 list, pm2 status를 입력했을 때는 하나의 인스턴스가 태스크화 돼서 실행 중이고 name에는 `npm`, exec mode는 `fork`라는 것을 확인할 수 있었음
- 그래서 컨테이너에서 실행 스크립트를 위한 옵션 및 내용을 담고있는 ecosystem.config.js파일을 의심함
- 다음과 3가지 내용을 수정함(EC2에서 정상 실행된 환경 동일하게 세팅해줌)
  - name: NFTeam_SocketServer => npm
  - exec_mode: (공식 문서를 보니 디폴트 값이 fork여서) cluster => 주석 처리하여 fork모드로 실행
  - instances: 2 => 주석 처리하여 기본 1개의 인스턴스로 실행하게 함
- 성공!!
  - 로그를 확인하려고 젠킨스 빌드 옵션에서 docker run -d를 빼고 했더니 로그 메세지가 계속 뜨는 상태라 다음 빌드 명령어를 수행하기 위해 젠킨스가 컨테이너를 중지시킴 => 빌드가 끝난 뒤 컨테이너가 실행 중이지 않음 => 직접 수동으로 docker run 해보았더니 정상작동 => 후에 빌드 옵션을 정상적으로 설정하니제대로 작동함을 확인