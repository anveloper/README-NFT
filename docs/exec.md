# 🛰배포, 실행 문서

## 🚢Port

프로젝트의 각 주요 구성 요소의 포트 번호는 다음과 같습니다.

### EC2

| Port | 이름                            |
| ---- | ------------------------------- |
| 80   | Nginx(Http => Https 리다이렉트) |
| 443  | Https                           |
| 3000 | React                           |
| 3306 | MySQL                           |
| 5000 | Node.js(Web Socket)             |
| 8085 | Springboot                      |
| 9090 | Jenkins                         |

<br>

### 블록체인 네트워크

| Port | 이름 |
| ---- | ---- |
| 4001 | Ipfs |
| 5001 | Ipfs |
| 8080 | Ipfs |

<br>

## 🏗프로젝트 실행

### 개요

놀면서 그리는 NFT 서비스 'README'는 Jenkins를 이용한 CI/CD 자동화 환경으로 구성하였습니다.

팀 구성원이 작업한 코드를 Gitlab에 Push하면 Webhook을 통해 Jenkins 빌드 구성에 따라 CI/CD 흐름이 진행됩니다.

> 각 프로젝트의 Dependencies는 프로젝트 폴더별 환경 파일들에서 확인할 수 있습니다.

<br>

### 환경 구성 순서

1. MySQL 도커 이미지 설치 및 컨테이너 실행, 환경 설정
2. Jenkins 도커 이미지 설치 및 컨테이너 실행, 빌드 환경 구성
3. Backend 서버(Springboot) 도커 이미지 생성 및 컨테이너 실행
4. Frontend 서버(React) 도커 이미지 생성 및 컨테이너 실행
5. Nginx 설치 및 SSL 적용
6. Web Socket 서버(Node.js) 도커 이미지 생성 및 컨테이너 실행

<br>

> 각 단계별로 서술하였으며, 자세한 과정을 보고 싶으면 자세히 보기를 통해 환경 구성 과정을 볼 수 있습니다.

### 1. MySQL

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/01_MySQL 환경 구성.md)

<br>

### 2. Jenkins

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/02_Jenkins 환경 구성.md)

#### 빌드 단계

> Execute Shell

```jenkins
docker image prune -a --force
mkdir -p /var/jenkins_home/images_tar

cd /var/jenkins_home/workspace/deployment/frontend
docker build -t reactfrontend .
docker save reactfrontend > /var/jenkins_home/images_tar/reactfrontend.tar

cd /var/jenkins_home/workspace/deployment/backend
docker build -t springbackend .
docker save springbackend > /var/jenkins_home/images_tar/springbackend.tar

cd /var/jenkins_home/workspace/deployment/socket
docker build -t socketserver .
docker save socketserver > /var/jenkins_home/images_tar/socketserver.tar

ls /var/jenkins_home/images_tar
```

<br>

#### 빌드 후 조치

```jenkins
sudo docker load < /jenkins/images_tar/springbackend.tar
sudo docker load < /jenkins/images_tar/reactfrontend.tar
sudo docker load < /jenkins/images_tar/socketserver.tar

if (sudo docker ps | grep "reactfrontend"); then sudo docker stop reactfrontend; fi
if (sudo docker ps | grep "springbackend"); then sudo docker stop springbackend; fi
if (sudo docker ps | grep "socketserver"); then sudo docker stop socketserver; fi

sudo docker run -it -d --rm -p 3000:3000 --name reactfrontend reactfrontend
echo "Run frontend"

sudo docker run -it -d --rm -p 8085:8085 --name springbackend springbackend
echo "Run backend"

sudo docker run -it -d --rm -p 5000:5000 --name socketserver socketserver
echo "Run socket"
```

<br>

### 3. Backend

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/03_Backend 환경 구성.md)

#### Dockerfile

```dockerfile
FROM openjdk:8-jdk-alpine AS build

COPY gradlew .

COPY gradle gradle

COPY build.gradle .

COPY settings.gradle .

COPY src src

RUN chmod +x gradlew

RUN ["./gradlew", "bootJar"]

FROM openjdk:8-jdk-alpine

COPY --from=build build/libs/*.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "/app.jar"]
```

<br>

### 4. Frontend

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/04_Frontend 환경 구성.md)

#### Dockerfile

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

<br>

#### nginx.conf

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

<br>

### 5. Nginx, SSL

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/05_Nginx%2C SSL 설정.md)

#### nginx.conf

> /etc/nginx/nginx.conf

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
	worker_connections 768;
	# multi_accept on;
}

http {

	##
	# Basic Settings
	##

	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;
	keepalive_timeout 65;
	types_hash_max_size 2048;
	# server_tokens off;

	# server_names_hash_bucket_size 64;
	# server_name_in_redirect off;

	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	##
	# SSL Settings
	##

	ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
	ssl_prefer_server_ciphers on;

	##
	# Logging Settings
	##

	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;

	##
	# Gzip Settings
	##

	gzip on;

	# gzip_vary on;
	# gzip_proxied any;
	# gzip_comp_level 6;
	# gzip_buffers 16 8k;
	# gzip_http_version 1.1;
	# gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

	##
	# Virtual Host Configs
	##

	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}


#mail {
#	# See sample authentication script at:
#	# http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
# 
#	# auth_http localhost/auth.php;
#	# pop3_capabilities "TOP" "USER";
#	# imap_capabilities "IMAP4rev1" "UIDPLUS";
# 
#	server {
#		listen     localhost:110;
#		protocol   pop3;
#		proxy      on;
#	}
# 
#	server {
#		listen     localhost:143;
#		protocol   imap;
#		proxy      on;
#	}
#}
```

<br>

#### B108.conf

> /etc/nginx/sites-available

```nginx
server {

        location /{
                proxy_pass http://localhost:3000;
        }

        location /api {
                proxy_pass http://localhost:8085;
        }

	location /swagger-ui {
              return 301  http://j7b108.p.ssafy.io:8085/swagger-ui/index.html;
	}	

	location /socket.io {
		proxy_http_version 1.1;
		
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";

		proxy_pass http://localhost:5000/socket.io;
	}

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/j7b108.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/j7b108.p.ssafy.io/privkey.pem; # managed by Certbot
    # include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = j7b108.p.ssafy.io) {
	return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        server_name j7b108.p.ssafy.io;
    return 404; # managed by Certbot
}
```

<br>

### 6. Web Socket

[자세히 보기](https://lab.ssafy.com/s07-blockchain-nft-sub2/S07P22B108/-/blob/feature/back-issue50/docs/배포 환경 구성 상세/06_Socket 환경 구성.md)

#### Dockerfile

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

<br>

#### ecosystem.config.js

```javascript
module.exports = [{
  script: 'dist/server.js',
  name: 'npm',
  env_production: {
    NODE_ENV: "production"
  },
}]
```

