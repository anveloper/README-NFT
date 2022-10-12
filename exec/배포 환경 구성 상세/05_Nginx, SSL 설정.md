# 05_Nginx, SSL 설정

## 사용 기술 스택

> nginx, Let's Encrypt

|                                                      Nginx                                                      |                                                                              Let's Encrypt                                                                               |
| :-------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
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
sudo letsencrypt certonly --standalone -d [도메인]
```

이메일 입력, 구성 선택 등 메시지를 따라서 진행한 뒤에 "Congratulations!"로 시작하는 문구가 보이면, 인증서 발급이 완료된 것임

![화면 캡처 2022-09-15 102320](https://user-images.githubusercontent.com/93081720/192927381-0f8add5a-542e-4298-a876-317c24fc755b.png)

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
    ssl_certificate /etc/letsencrypt/live/[도메인]/fullchain.pem; # managed by Certbot
    # 도메인 이름을 써줘야함
    ssl_certificate_key /etc/letsencrypt/live/[도메인]/privkey.pem; # managed by Certbot
    # include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    # 도메인 이름을 입력
    if ($host = [도메인]) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        server_name [도메인];
    return 404; # managed by Certbot
}
```

<br>

### 커스텀 파일 적용

> sudo ln -s /etc/nginx/sites-available/[파일명] /etc/nginx/sites-enabled/[파일명]

```bash
sudo ln -s /etc/nginx/sites-available/b108 /etc/nginx/sites-enabled/b108
```

- ln: link(연결)의 의미

<br>

> 다음 명령어(nginx 테스트)에서 successful이 뜨는 nginx를 정상적으로 실행할 수 있다.

```bash
sudo nginx -t
```

<br>

> nginx 재시작

```bash
sudo systemctl restart nginx
```

<br>

### 특정 포트만 http로 연결하기

상황에 따라 특정 포트로 들어오는 요청만 http로 설정하게 할 수 있다.

해당 방법은 모든 http요청이 https로 리다이렉트되는 상황에서 임시적으로 사용 가능한 방법이므로 급할 경우에 참고만 할 것

#### 스웨거 연결하기 예시

다음과 같은 nginx 설정인 상황에서 배포 서버의 https로 swagger를 열어야하는데 원하는 대로 열리지 않는 경우가 있다. location /swagger-ui로 분명히 proxy_pass를 설정해줬음에도 Bad Gateway를 리턴할 경우 급한대로 http로 열리게 하는 방법이 있다.

```nginx
server {
        location /{
                proxy_pass http://localhost:3000;
        }

        location /api {
                proxy_pass http://localhost:8085;
        }

	.. 중략...
}
```

<br>

#### 방화벽 설정

명령어

- sudo ufw enable : 방화벽 활성화
- sudo ufw disable : 방화벽 비활성화
- sudo ufw app list : 포트를 사용 중인 앱 리스트 출력
- sudo ufw status: 방화벽 포트 상태 출력
- sudo ufw allow [포트 번호] : 특정 포트 번호를 허락함
- sudo ufw deny [포트 번호] : 특정 포트 번호를 닫음

<br>

sudo ufw enable으로 방화벽을 활성화 한 다음에 sudo ufw status로 방화벽 포트 상태를 출력한다. 해당 리스트에 없는 포트 중에 아무거나 원하는 숫자를 골라서 sudo ufw allow [포트 번호]를 통해 해당 포트로 들어오는 요청을 허락한다

그 후 다음과 같이 server 블록에 이어서 작성한다.

```nginx
	location /swagger-ui {
		return 301  http://[도메인]:8085/swagger-ui/index.html;
	}
```

해당 포트에 한해서만 http를 허락했으므로 배포 서버 url로 swagger 문서를 확인할 수 있다.

<br>

#### 만약 request가 매번 다르다면?

http://도메인/user1, http://도메인/user2와 같이 url이 바뀌어서 요청되는 경우에는 http로 리다이렉트 되더라도 요청했던 url을 유지해야한다. 이 때 사용가능한 것이 있다.

http://도메인/readme/1, http://도메인/readme/16과 같이 들어온다고 가정

```nginx
	location /readme/ {
		return 301 http://[도메인]:3000$request_uri;
	}
```

- `$request_uri`라는 nginx 변수를 통해서 맵핑해주면 된다.
  - /readme/ 이후에 들어온 요청에 대한 파라미터 값을 /readme/와 함께 그대로 반환한다.
- [도메인]는 `$host`로 쓸 수 있긴 하다.
