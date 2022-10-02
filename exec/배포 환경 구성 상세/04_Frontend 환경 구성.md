# 04_Frontend 환경 구성

## 사용 기술 스택

> Docker, Nginx, React

|                            Docker                            |                            Nginx                             |                            React                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/191644534-9b7be4af-66f6-4107-88d9-8badf5856919.png) | ![image](https://user-images.githubusercontent.com/93081720/191644574-dbd9eb91-232d-4d50-93b9-75f1f30720b6.png) | ![image](https://user-images.githubusercontent.com/93081720/191644601-576ae164-b383-4458-9a25-f9686a522140.png) |

<br>

## 소스 코드

### Dockerfile

>  node를 통해 npm으로 빌드 환경을 구성한 뒤에 컨테이너에 해당 결과의 스냅샷을 복사해온 다음에 Nginx위에서 동작하게 함

```dockerfile
FROM node:16.15.0 AS build

WORKDIR /jenkins_home/workspace/deployment/frontend

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

COPY --from=build /jenkins_home/workspace/deployment/frontend/build ./build

COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
```

#### 과정 설명

1. node를 build 환경으로서 불러온다
2.  컨테이너 안에 `/jenkins_home/workspace/deployment/frontend`로 워킹 디렉토리를 설정한다
   - 만약 해당 디렉토리가 없다면 docker가 알아서 자동으로 만들어준다
3. Dependency 파일을 로컬에서 컨테이너의 워킹 디렉토리로 복사해온다
   - 에스테릭(*)을 사용해서 여러 파일을 복사해올 때는 워킹 디렉토리를 표현할 때 `.` 으로만 쓰면 안 되고, `./`으로 써야한다.
4. npm install
5. COPY . . 을 통해 현재 로컬에 있는 모든 파일을 복사해온다
6. npm run build를 통해 빌드 결과를 생성함
7. 컨테이너 환경에서 nginx 설치
8. `/etc/nginx/conf.d`에 있는 default.conf를 삭제함
9. `/app` 폴더를 만들고, 워킹 디렉토리를 `/app`으로 설정함
10. `/app` 아래 `/build` 파일을 생성
11. 빌드 스테이지에서 빌드한 결과를 `/build`파일로 복사해옴
12. 로컬에 있는 nginx.conf를 `/etc/nginx/conf.d`으로 복사하여 사용
13. 포트 번호를 3000번으로 명시(기능적인 효과 없음)
    - ※ EXPOSE는 컨테이너에 포트를 직접 연결해주는 기능을 하지 않고, 연결 포트가 무엇인지 알려주는 명시적인 역할을 할뿐 기능은 없다 => 실제 포트를 연결하는 것은 docker run에서 -p를 통해서 설정하는 것임
14. nginx 환경 실행

<br>

### nginx.conf

```nginx
server {
    listen 3000;
    location / {
        root    /app/build;
        index   index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

#### 과정 설명

- listen
  - 3000번 포트를 연결함
- location 설정
  - root에 들어가는 경로는 npm run build를 통해 생성되는 index.html이 있는 곳임

<br>
