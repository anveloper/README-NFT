# 02_Jenkins 환경 구성

### 사용 기술 스택

> Jenkins

|                           Jenkins                            |
| :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/191645439-6e86c92c-3fb9-490c-a23c-fa7fb70bf746.png) |

Docker-Compose를 이용하여 젠킨스 이미지를 설치하고 빌드 환경을 구성하여, 작업 결과를 push했을 때, webhook을 통해 자동으로 빌드를 시작하게끔 설정까지 진행하고자함

|                           Gitbash                            |                            GitLab                            |                          MatterMost                          |                           WebHook                            |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/191645514-4ae10874-29e5-4ba3-9a00-9f28d7e9de0a.png) | ![image](https://user-images.githubusercontent.com/93081720/191645529-45574978-02aa-467d-b93d-49d330d93cb3.png) | ![image](https://user-images.githubusercontent.com/93081720/191652706-d359e689-539d-4ffe-a955-c24cdbec3f75.png) | <img src="https://user-images.githubusercontent.com/93081720/191664859-c891137c-0f67-4a3f-84d3-664ca0a915ea.png" referrerpolicy="no-referrer" alt="image" width="300px"> |

<br>

## 환경 구성 과정

### 1. Docker 설치

> EC2에 도커 설치하기. 자세한 것은 공식문서를 참조하는 것을 권장함

#### 사전 패키지 설치

```bash
sudo atp update

sudo apt-get install -y ca-certificates \
    curl \
    software-properties-common \
    apt-transport-https \
    gnupg \
    lsb-release
```



#### gpg키 설치

도커를 설치하기 위해 gpg Key를 다운받아야 함. 이는 리눅스 패키지 툴이 프로그램 패키지가 유효한지 확인하기 위해 설치 전에 gpg 키를 통해 검증하는 과정을 거치기 때문이라고 함

```bash
sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```



#### 도커 설치

```bash
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```

<br>

### 2. Jenkins 설치

#### docker-compose.yml

```bash
sudo vim docker-compose.yml
```

```dockerfile
version: '3'

services:
    jenkins:
        image: jenkins/jenkins:lts
        container_name: jenkins
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock
            - /jenkins:/var/jenkins_home
        ports:
            - "9090:8080"
        privileged: true
        user: root
```

- ecs를 누르고 :wq를 통해 write & quit

#### 컨테이너 생성

```bash
sudo docker-compose up -d
```

<br>

#### Jenkins plugin 설치

도메인:9090 포트로 접속하면 아래와 같이 어드민 비밀번호를 입력하고 

![image](https://user-images.githubusercontent.com/93081720/191662258-7cf44cfa-76ca-42bf-b5bf-a15c2e08e2f8.png)

<br>

`sudo docker logs jenkins`를 통해서 jenkins Administrator password를 확인할 수 있다.

![image](https://user-images.githubusercontent.com/93081720/191661675-fae35efa-22dc-4cdd-a1ad-3a52f4afee3c.png)

<br>

#### 기본 플러그인 설치

![image](https://user-images.githubusercontent.com/93081720/191662709-3b3e6afb-5228-4a0c-83dc-d317e2b345d0.png)

<br>

#### 계정 생성

원하는 계정명과 비밀번호를 설정하여 계정을 생성한다

![image](https://user-images.githubusercontent.com/93081720/191662872-6f195fff-7e65-4f65-9f92-65cac427afb0.png)

<br>

#### Jenkins 관리 > 플러그인 관리

추가 플러그인 설치를 한다

![image](https://user-images.githubusercontent.com/93081720/191663424-5328f9ca-75a6-4482-b943-0d84aa8910c0.png)

<br>

![image](https://user-images.githubusercontent.com/93081720/191663444-d9706a0f-0829-4ebc-9ba8-c32145f52dc7.png)

<br>

gitlab, docker, SSH관련 플러그인을 설치해준다

단, 설치 시 `install without restart`를 적용하여 재시작 없이 플러그인을 설치한다.

![image](https://user-images.githubusercontent.com/93081720/191664182-36c31681-5ea3-4cf5-adf7-9c1296cfc6f1.png)

![image](https://user-images.githubusercontent.com/93081720/191664275-252a3316-e84c-4b0e-adc9-1290450878b2.png)

![image](https://user-images.githubusercontent.com/93081720/191664295-16a68cde-60a2-48fa-8f5d-4a5a4c3d18c6.png)

<br>

![image](https://user-images.githubusercontent.com/93081720/191664792-9d4d7a40-ff2d-44e4-9ed7-e6144d56dabb.png)

<br>

### 3. Jenkins 프로젝트 생성

젠킨스 메인페이지에서 `새로운 item` 을 클릭하여 새로운 페이지를 생성합니다

![image](https://user-images.githubusercontent.com/93081720/191664980-95687517-29a7-4619-aeb5-336f95447193.png)

<br>

>  이번 Jenkins 프로젝트는 freestyle project로 생성합니다. pipeline으로도 프로젝트를 생성하여 프로젝트를 관리할 수도 있습니다.

프로젝트 명을 정한 뒤에  freestyle project로 생성합니다.

![image](https://user-images.githubusercontent.com/93081720/191665108-876a7071-3160-469c-a7dd-0e3c911ced54.png)

<br>

#### 레포지토리 등록

소스 코드 관리란에 들어가서 레포지토리를 등록한다

![image](https://user-images.githubusercontent.com/93081720/191666699-c2ce269c-f271-4e12-95c2-60e41b08cd8d.png)

<br>

`credentials`에서 `add`를 하여 gitlab과 연결된 계정을 등록한다.

아마 계정이 등록이 안 됐거나 잘못된 credentials일 경우 아래와 같이 빨간색 메시지가 떠있다

![image](https://user-images.githubusercontent.com/93081720/191667006-47495c15-92ee-4bd9-b664-1e4cec6e148a.png)

<br>

#### 연결된 계정 등록

- username
  - 깃랩과 연결된 메일
- Password
  - 깃랩의 비밀번호
- ID
  - 아무 아이디나 입력해도 된다고 하지만, 깃랩의 아이디를 넣는 것을 권장함(에러가 발생하는 경우가 있어서)

![image](https://user-images.githubusercontent.com/93081720/191668285-1a5162be-b348-43bd-80de-adcd3fa55cd9.png)

#### 연결

![image](https://user-images.githubusercontent.com/93081720/191669080-dc728d24-5f95-4d51-b09e-1716de4a19c0.png)

#### 빌드 유발

아래 그림과 같이 체크박스에 체크한 뒤에 고급을 눌러서

![image](https://user-images.githubusercontent.com/93081720/191669807-ae8e4349-6fd1-4b6b-bc00-f0b6cc5f98a3.png)

<br>

#### 토큰 생성

고급에서 generate를 눌러서 토큰을 생성합니다

해당 토큰은 gitlab과 연결하기 위해 사용되는 토큰입니다.

![image](https://user-images.githubusercontent.com/93081720/191669972-2c0470d3-d3fb-403b-9362-c518a6464309.png)

<br>

#### 깃랩과 WebHook 연결하기

깃랩 setting에서 webhook으로 들어갑니다

![image](https://user-images.githubusercontent.com/93081720/191671058-fec46c65-b3bf-43a9-9174-b7a165c8a78b.png)

<br>

URL에는 `http://배포서버도메인:9090/project/생성한 jenkins 프로젝트이름/`을 입력해줍니다.

Secret token에는 아까 위에서 젠킨스 프로젝트를 생성할 때 저장해둔 값을 입력합니다.

빌드 유발 Trigger로, `Push events`, `Merge request events`를 설정합니다.

대상 Branch는 연동을 원하는 브랜치를 선택합니다.

![image](https://user-images.githubusercontent.com/93081720/191671232-bfcc43cf-5539-4b93-8661-7120ad70683a.png)



완료했다면 하단의 Add Webhook 버튼을 눌러 webhook을 생성합니다



![image](https://user-images.githubusercontent.com/93081720/191671594-03373438-87e3-4a36-ad13-8739a08993b1.png)

생성을 다하고 나면, 생성된 웹훅에서 test, push event를 눌러서 테스트를 진행합니다.

200이 나오면 성공입니다.

![image](https://user-images.githubusercontent.com/93081720/191671803-1e1a6670-8d62-4226-aa24-bedf407e50bb.png)

<br>

### 4. Jenkins에서 Docker 이미지 빌드하기

젠킨스에서 도커 이미지를 빌드하고, 컨테이너를 실행하기 위해서는 Jenkins 컨테이너 안에 도커를 설치해야합니다. 그러나 컨테이너 안에 컨테이너를 실행하는 방법(DID; Docker in Docker)은 도커에서 권장하는 방법이 아니지만, 일단 해당 방법으로 진행합니다.

#### Jenkins 컨테이너 안에 도커 설치하기

EC2 환경에서 사전에 도커를 설치했던 것과 마찬가지로 도커 설치를 진행한다. 차이가 있다면, jenkins 컨테이너 환경에서 설치하기 위해서 jenkins bash shell에 접근해야하는 것과 jenkins의 os가 debian이므로 gpg키를 설치할 때 debian으로 설정해주면 된다.

- jenkins bash shell 접근하기

```bash
sudo docker exec -it jenkins bash
```

- 사전 패키지 설치

```bash
sudo atp update

sudo apt-get install -y ca-certificates \
    curl \
    software-properties-common \
    apt-transport-https \
    gnupg \
    lsb-release
```

- gpg 키 설치

> ubuntu를 debian으로 바꿔서 gpg키를 설치해야한다

```bash
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
```

- 도커 이미지 설치

```bash
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-compose
```

<br>

### 5. jenkins 도커 이미지 빌드를 하기

#### Dockerfile 작성하기

도커 파일 작성은 Backend, Frontend, Socket 항목에 작성해놓았으므로 해당 항목을 참조하면 됩니다.

<br>

#### jenkins 빌드 구성

빌드 단계에 들어가서 `Add build step`을 누르고 `Execute Shell`을 선택하여 아래와 같이 입력합니다.

![image](https://user-images.githubusercontent.com/93081720/191674903-7aaa4021-25a4-4951-a1ae-e51d434ede53.png)

```bash
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

- docker image prune -a --force
  - 사용하지 않는 이미지 삭제
- mkdir -p /var/jenkins_home/images_tar
  - 도커 이미지 압축파일을 저장할 폴더 생성
- cd /경로
  - 해당 경로로 이동
- docker build -t 이미지 태그명.
  - 도커 이미지 빌드
- docker save 태그명 > /var/jenkins_home/images_tar/저장할 파일명.tar
  - 도커 이미지를 저장할 파일명.tar로 압축하여 위에서 생성한 폴더에 저장
- ls /var/jenkins_home/images_tar : 해당 폴더에 있는 파일 목록 출력(잘 압축되어 저장되었는지 확인)

<br>

### 6. Jenkins에서 빌드한 이미지를 자동으로 컨테이너화하기

젠킨스에서 빌드한 .tar 파일을 자동으로 컨테이너화하기 위해서는 SSH연결 설정을 해야한다

두 가지 방법이 있는데 먼저 AWS 키를 입력하는 방식으로 진행한다.

#### Jenkins SSH 연결 설정(Publish over SSH) - AWS 키 입력 방식

`Jenkins 관리` 탭에서 `시스템 설정` 클릭

![image](https://user-images.githubusercontent.com/93081720/191680214-4be47f6f-32d6-497b-a6e9-6808f9f84577.png)

`Public over SSH` 항목에서 `SSH Servers` 추가 버튼 클릭

![image](https://user-images.githubusercontent.com/93081720/191680251-95aa52f5-14da-4e2c-98e2-006a783a579c.png)

Name, Hostname, Username에 정보를 입력합니다.

그후 고급 버튼을 눌러서 AWS키를 입력해줘야합니다.

![image](https://user-images.githubusercontent.com/93081720/191680456-4ee736d8-c05d-437c-8b9b-900e8496f053.png)

- Name : 그냥 이름
- Hostname : EC2 IP (IPv4 address for XXXXXX에 뜨는 IP를 작성)
- Username : EC2 접속 계정 이름

![image](https://user-images.githubusercontent.com/93081720/191681112-e93ab9c8-555d-4160-818e-13f0e7c737ab.png)

<br>

Key에 AWS의 내용을 입력해줍니다.

![image](https://user-images.githubusercontent.com/93081720/191681837-f0a15243-db09-4beb-a4dd-1fa7527fd2be.png)

이후 하단의 `Test Configuration` 버튼을 눌렀을 때 Success가 나오면 성공!!

그러나 오류가 난다면 Ubuntu 계정의 패스워드를 등록하는 방식으로 진행하면 된다.

오류의 원인은 ubuntu 버전에 따른 이슈인듯합니다.

![image](https://user-images.githubusercontent.com/93081720/191681983-47740f51-b48e-49e9-b553-62df66e3da52.png)

<br>

#### Jenkins SSH 연결 설정(Publish over SSH) - ubuntu계정 비밀번호 입력 방식

먼저, 현재의 root 계정에 비밀번호를 설정합니다. 비밀번호는 최대한 어렵게 설정하세요.

```bash
sudo passwd
```

그후 `su -`명령어를 입력하고, root 계정 접속 후 passwd ubuntu 명령어를 입력하여 ubuntu 계정의 비밀번호를 설정해주면 됩니다.

![image](https://user-images.githubusercontent.com/93081720/191682583-b23fe3a9-7ec2-42cb-a739-a6211865d07e.png)

```bash
su -
passwd ubuntu
```

기본적으로  EC2에는 기본적으로 id,pw을 이용한 로그인이 차단되어있으므로 이를 해제해줘야합니다.

```bash
sudo vim /etc/ssh/sshd_config
```

sshd_config 파일을 열고 `PasswordAuthentication`을 no에서 yes으로 바꾸고, `esc :wq` 를 통해서 저장합니다.

![image](https://user-images.githubusercontent.com/93081720/191683369-204e427c-3aa2-4a69-bebf-915502f21204.png)

마지막으로 `service sshd reload`명령어를 통해 sshd를 재시작해주면 거의 다 됐습니다.

```bash
service sshd reload
```

`Passphrase / Password`에 ubuntu 패스워드를 입력해주고, `Test Configuration` 버튼을 눌렀을 때 Success가 나오면 성공입니다.

![image](https://user-images.githubusercontent.com/93081720/191683578-b44d65f0-e75b-4a4e-903b-4e1cba59643d.png)

#### 빌드 후 조치

`Source files`는 컨테이너에서 aws로 파일을 전송하는 부분인데, 의미가 없는데도 필수 입력 사항이기 때문에 적당히 아무거나 적어줍니다. 중요한 부분은 `Exec command`부분입니다.

![image](https://user-images.githubusercontent.com/93081720/191684171-6557cf36-a808-4833-91d7-af7bbe3772c8.png)

해당 부분에 아래와 같이 이미지 빌드가 끝난 뒤에 jenkins가 해야할 일들에 대한 명령어를 입력합니다.

```
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

- sudo docker load < /jenkins/images_tar/springbackend.tar
  - springbackend.tar을 압축 해제하여 docker 이미지로 등록
- if (sudo docker ps | grep "springbackend"); then sudo docker stop springbackend; fi
  - 만약 "springbackend"라는 이름의 컨테이너가 현재 동작중이면 중지(stop)시킴
- sudo docker run -it -d --rm -p 8085:8085 --name springbackend springbackend
  - 컨테이너 생성하기; 컨테이너의 이름은 "springbackend"로, -d(detach모드), -it(interactive모드), -p 연결할 포트를 지정하여 컨테이너를 실행

이후 저장하고 빌드를 누르면 끝입니다.

Nginx에 관한 설정은 각 프로젝트의 nginx나 nginx와 ssl 적용 항목을 참고해서 적용하면 됩니다.

<br>

### 추가 MM과 연동해보기

완벽하지는 않지만 MM에 빌드가 성공했을 경우 메세지를 보낼 수도 있습니다.

빌드 구성 단계에서 도커 이미지 빌드 작업이 다 끝난 이후에 해당 액션이 발생할 수 있도록

새롭게 빌드 단계를 추가하여 아래와 같이 입력해줍니다.

![image](https://user-images.githubusercontent.com/93081720/191686341-33506d84-00e9-44e0-bd19-e68e226b8a9e.png)

상세 내용은 다음과 같습니다.

```php
#!/bin/bash
COMMIT_MSG=$(git log --oneline --format=%B -n 1 HEAD | head -n 1)
REQUETE="curl -i \
        -X POST \
        -H 'Content-Type: application/json' \
        -d '{ \
                \"channel\": \"B108_BOT\", \
                \"icon_url\": \"https://www.mattermost.org/wp-content/uploads/2016/04/icon.png\", \
                \"attachments\": [{ \
                        \"fallback\": \"새로운 빌드\", \
                        \"color\": \"#00b7ff\", \
                        \"author_name\": \"Jenkins BOT_박시원\", \
                        \"author_icon\": \"https://raw.githubusercontent.com/jenkinsci/jenkins/master/war/src/main/webapp/favicon.ico\", \
                        \"author_link\": \"https://myjenkins.com/\", \
                        \"text\": \"빌드 정보 :\", \
                        \"title\": \"$COMMIT_MSG\", \
                        \"title_link\": \"$BUILD_URL\", \
                        \"fields\": [{ \
                                  \"short\":true, \
                                  \"title\":\"브랜치\", \
                                  \"value\":\"develop\" \
                        }, \
                        { \
                                  \"short\":true, \
                                  \"title\":\"버전\", \
                                  \"value\":\"$_PROJECT_VERSION\" \
                        }, \
                        { \
                                \"short\":false, \
                                \"title\":\"상세정보\", \
                                \"value\":\"$BUILD_URL\" \
                        }] \
        }] \
        }'\
        https://meeting.ssafy.com/hooks/o3mhqjih1bfad8go3gjbzioybw"
eval $REQUETE
```

여기서 제일 마지막에서 두번째에 있는 url을 MM에서 발급받은 Incoming Webhook의 주소를 써주시면 됩니다.



이것으로 Jenkins 빌드 자동화 과정을 끝마칩니다.

























