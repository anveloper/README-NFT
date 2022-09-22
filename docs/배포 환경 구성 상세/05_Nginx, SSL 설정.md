# 05_Nginx, SSL 설정

## 사용 기술 스택

> nginx, Let's Encrypt

|                            Nginx                             |                        Let's Encrypt                         |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/191642177-285bdd09-71f7-471f-afa4-a356c0d901e5.png) | <img src="https://user-images.githubusercontent.com/93081720/191642327-817e9ce2-b3ff-43c1-a01b-9cbb9867231c.png" referrerpolicy="no-referrer" alt="image" width="500px"> |

<br>

## Nginx 설정

### Nginx 설치

```
sudo apt-get install nginx
```

> 버전 확인

```
sudo nginx -v
```

프론트 nginx 설정은 프론트 환경 구성 참조

<br>

## SSL 설정

### Let's Encrypt 설치

```
sudo apt-get install letsencrypt
```

> Nginx 중지

```
sudo systemctl stop nginx
```

<br>

### Key 발급

> sudo letsencrypt certonly --standalone -d <도메인>

```
sudo letsencrypt certonly --standalone -d j7b108.p.ssafy.io
```

이메일 입력, 구성 선택 등 메시지를 따라서 진행한 뒤에  "Congratulations!"로 시작하는 문구가 보이면, 인증서 발급이 완료된 것임

<br>

#### 발급 경로 확인

> cd /etc/letsencrypt/live/<도메인>

다음과 같이 키가 있음을 확인해야함

![image](https://user-images.githubusercontent.com/93081720/191643088-ab03d95e-c950-4c5f-98e3-425b8bcff995.png)

<br>

### 커스텀 파일 생성

> /etc/nginx/sites-available로 이동한 후, 적절한 이름의 파일을 생성 (필자는 팀 코드네임인 b108로 생성함)

#### B108.conf

```nginx
server {
		# 프론트 연결(포트 번호는 본인의 프론트 포트번호를 입력)
        location /{
                proxy_pass http://localhost:3000;
        }
		
    	# 백엔드 연결(포트 번호는 본인의 백엔드 포트번호를 입력)
        location /api {
                proxy_pass http://localhost:8080/api;
        }

    listen 443 ssl; # managed by Certbot
    # 도메인 이름을 써줘야함
    ssl_certificate /etc/letsencrypt/live/j7b108.p.ssafy.io/fullchain.pem; # managed by Certbot
    # 도메인 이름을 써줘야함
    ssl_certificate_key /etc/letsencrypt/live/j7b108.p.ssafy.io/privkey.pem; # managed by Certbot
    # include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    # 도메인 이름을 입력
    if ($host = j7b108.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        server_name j7b108.p.ssafy.io;
    return 404; # managed by Certbot
}
```

<br>

### 커스텀 파일 적용

> sudo ln -s /etc/nginx/sites-available/[파일명] /etc/nginx/sites-enabled/[파일명]

```
sudo ln -s /etc/nginx/sites-available/b108 /etc/nginx/sites-enabled/b108
```



> 다음 명령어에서 successful이 뜨는 nginx를 정상적으로 실행할 수 있다.

```
sudo nginx -t
```



> nginx 재시작

```
sudo systemctl restart nginx
```

