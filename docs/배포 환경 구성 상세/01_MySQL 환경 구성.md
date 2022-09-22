# 01_MySQL 환경 구성

## 사용 기술 스택

> MySQL

<img src="https://user-images.githubusercontent.com/93081720/191645601-4e8f6ea0-ec6b-43fb-b2bc-5c974d859380.png" referrerpolicy="no-referrer" alt="image" width="500px" height="300px">

## 환경 구성 과정

MySQL 환경 구성에는 EC2에 직접 설치하는 방법과 도커 허브에서 MySQL 이미지를 가져와서 컨테이너를 통해 실행하는 방법이 있다.

그러나 DB를 컨테이너로 구성하게 되면 컨테이너가 종료될 경우 해당 데이터가 사라지게 된다. 물론 볼륨이나, 바인딩 마운트를 통해 컨테이너가 사라지더라도 데이터를 저장할 수도 있겠지만, 추가적인 볼륨 세팅이 필요하다.

여기서는 EC2에 직접 설치하는 방법을 설명하고자 한다.

### 과정 설명

#### EC2 서버 업데이트 진행

```bash
sudo apt update
```



#### MySQL 설치

```bash
sudo apt install mysql-server
```

- MySQL 상태 확인

```
sudo systemctl status mysql
```



#### MySQL root 계정 접속

입력 시, 비밀번호를 입력하라고 뜨나, 아직 비밀번호가 설정된 상태가 아니므로 아무거나 입력해도 접속 가능함

```
sudo mysql -u root -p
```



#### 유저 권한 설정

mysql이라는 DB의 user 테이블에 모든 사용자의 정보가 저장되어 있음

보안을 위해 해당 DB에 접근하여 root 계정의 비밀번호 변경과 추후 사용할 DB의 계정 생성 및 권한 부여 과정이 필요하기 때문에 이 과정을 진행하는 것임

```sql
use mysql;
```

- root 계정 비밀번호 변경

```sql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '[변경 비밀번호]';
```

- 변경 사항 적용

```sql
FLUSH PRIVILEGES;
```

- mysql 접속을 종료하여 비밀번호가 변경되었는지 확인한다

```sql
EXIT;
```

- mysql 재시작

```bash
sudo service mysql restart
```



#### 사용할 DB 생성

```sql
create database {사용할 DB명};
show databases;
```



#### 사용할 계정 생성

- mysql 테이블 접근

```sql
use mysql;
```

- 사용할 계정 생성

```sql
create user '{username}'@'{host}' identified by '{비밀번호}';
```

예)

```sql
create user 'nfteam'@'%' identified by 'asd123';
```

- `%`: 외부 호스트 접근 권한 부여



#### 계정 접근 권한 부여

```sql
grant all privileges on {DB명}.* to '{username}'@'{host}';
```

- ALL PRIVILEGES
  - 모든 권한을 부여한다는 의미(다른 옵션으로 일부만 부여 가능함)
- DB명.테이블명
  - 어떤 DB의 특정 테이블에 권한을 부여한다는 의미
  - *으로 쓸 경우 해당 DB의 모든 테이블을 의미
- 변경사항 적용

```sql
FLUSH PRIVILEGES;
```

- 권한 확인

```sql
SHOW GRANTS FOR [사용자 계정명];
SHOW GRANTS FOR '{username}'@'{host}';
```



#### 외부 접속 허용하기

> sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf로 접근하여 수정

```
bind-address = 0.0.0.0
```

- exit 및 mysql restart

```sql
EXIT;
```

```
service mysql restart
```



#### 확인

```
Hostname : j7b108.p.ssafy.io
Port : 3306
Username : 사용계정명
Password : 비밀번호
```

