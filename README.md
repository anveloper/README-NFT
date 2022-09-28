# 🖼놀면서 만드는 NFT, README 

## 🚀프로젝트 소개

> 사용자 간 그림 퀴즈를 맞추고 NFT화하는 서비스, 내 마음을 읽어줘 README!

![image](https://user-images.githubusercontent.com/93081720/192415599-63bd6f79-1c10-4bbd-894a-0b5cf56767d3.png)

![image](https://user-images.githubusercontent.com/93081720/192415675-d77d49ac-25d9-487a-9e5d-6975a9a09d18.png)

<br>

### 🤔기획 의도

> 내가 그린 재미있는 그림을 NFT화해서 창시자로 인정받고, 소유하거나 거래할 수 있다면 재미있지 않을까?

- 기존 NFT는 생성 및 거래 과정이 어렵고 불편함
- 생성/거래만 있는 NFT가 아닌, 게임과 소통을 통한 NFT 발급
- 말로만 듣던 NFT를 경험하고 싶은 욕구
- 내가 직접 만든 나만의 NFT를 생성하여 가지고 싶은 욕구

#### 🎯서비스 대상

NFT에 관심을 갖고 있으면서 게임을 좋아하는 젊은 세대 및 연령층

#### 🎨 UI/UX

누구나 가벼운 분위기로 그림 맞추기 게임을 즐길 수 있는 만큼 아기자기한 디자인을 채택함

<br>

### 📅일정

> 22.08.22(월) ~ 22.10.07(금) (총 7주)

- 기획 및 설계 : 08.22 ~ 09.08 (2.5주)
  - 프로젝트 아이디어 논의, 주제 구체화, 기술 스택 선정
  - 기능 요구 명세서 작성, ERD, 와이어프레임, 프로젝트 구조 설계
- 개발 : 09.08 ~ 09.30(3.5주)
  - 배포 및 인프라 구축, REST API 설계
  - 프로젝트 주요 기능 구현
  - 스마트 컨트랙트 작성, 블록체인 네트워크 연동
  - UCC 제작
- 수정, 완성 : 10.03 ~ 10.07 (1주)
  - 통합 테스트
  - 산출물 정리, 최종 발표

![image](https://user-images.githubusercontent.com/93081720/192416186-55efe735-b827-4215-8ce3-9e6c9f45aaee.png)

<br>

## 🔍프로젝트 정보
(설계 단계 산출물은 향후에 산출물.md 파일에 옮겨서 링크)
### 🛠기술 스택
- 기술 스택(상세 버전은 배포 메뉴얼로 옮길 예정)
- 시스템 아키텍처
- 빌드 및 배포 흐름도
![image](https://user-images.githubusercontent.com/93081720/192417991-296ae920-1ff6-42f0-978e-83e117af769e.png)

| 구분       | 기술스택        | 상세               | 버전                 |
| ---------- | --------------- | ------------------ | -------------------- |
| 공통       | 형상관리        | GitLab             |                      |
|            | 이슈관리        | Jira               |                      |
|            | 커뮤니케이션    | Notion, MatterMost |                      |
| 프론트엔드 | HTML5           |                    |                      |
|            | CSS3            |                    |                      |
|            | JavaScript(ES6) |                    |                      |
|            | React           | React              | 18.2.0               |
|            |                 | Redux              | 8.0.2                |
|            |                 | Router             | 6.4.0                |
|            | WebSocket       | socket.io-client   | 4.5.2                |
|            | IDE             | Visual Studio Code | 1.17.2               |
| 백엔드     | Java            | OpenJDK            | 1.8                  |
|            | Spring          | SpringBoot         | 2.5.1                |
|            | API Docs        | Swagger            | 3.0.0                |
|            | DB              | MySQL              | 8.0.30               |
|            |                 | JPA                | 2.5.1                |
|            | IDE             | IntellJ            | 17.0.3               |
| 소켓 서버  | NodeJs          | Express            | 4.18.1               |
|            |                 | Socket.io          | 4.5.2                |
| 인프라     | Sever           | AWS EC2            | GNU/Linux 5.4.0-1018 |
|            | CI/CD           | Docker             | 20.10.18             |
|            |                 | Jenkins            | 2.361.1              |
|            | Web/SSL         | Nginx              | 1.18.0               |

<br>

### 📑기능명세서
유저 스토리를 토대로 기능 명세서를 작성함

### 🗺와이어프레임

### 💾ERD

백엔드 서버 최소화 및 탈중앙화를 위한 DB 테이블을 설계함

![image](https://user-images.githubusercontent.com/93081720/192464139-1bd70517-9de6-408f-8637-29c72b8eeff3.png)

### 📡API
좋아요, 방 CRUD, 문제 풀이 API 구현


<br>

## ⭐프로젝트 특징 및 기능

### 🎞주요 구현 기능

(향후 업로드 예정)



## 🤝팀 소개

### 🙋‍♂️🙋‍♀️구성원 및 담당 역할

#### 🛰BE/SC

| 이름 | 개발 내용 |
| ------ | ------------ |
|[👨🏻‍💻 김우원](https://github.com/woowonKim) [📧](mailto:dyffh1031@naver.com)        |              |
|[👨🏻‍💻 박시원](https://github.com/siwon-park) [📧](mailto:zow777@naver.com)   |  |
|[👩🏻‍💻 이현정](https://github.com/lhynjn9) [📧](mailto:hyjei10@gmail.com)        |              |

#### 🌈FE

| 이름 | 개발 내용 |
| ------ | ------------ |
|[👨🏻‍💻 안성진](https://github.com/anveloper) [📧](mailto:hitedin@gmail.com)         |              |
|[👩🏻‍💻 강정현](https://github.com/taboowiths) [📧](mailto:jhkang9820@gmail.com)   |  |
|[👩🏻‍💻 김주연](https://github.com/Juuyeon) [📧](mailto:jyeon3930@naver.com) 

### ⚙팀 운영

|                             노션                             |                             Jira                             |                             Git                              |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/192472772-257048e0-0887-41fd-876c-324dbe90fb2d.png) | ![image](https://user-images.githubusercontent.com/93081720/192472638-9113553d-3605-4c7f-be19-5c731b3bcf66.png) | ![image](https://user-images.githubusercontent.com/93081720/192473023-5425c88a-4ff3-4342-8b95-dde5a5e4d501.png) |
|     노션 팀 페이지를 활용하여 매일 오전/오후 스크럼 진행     |      Jira를 활용한 전체 프로젝트 이슈 및 주간 이슈 관리      |       이슈 기반의 깃 브랜치 전략을 통한 프로젝트 관리        |



### ✒프로젝트 회고

#### 김우원

> dd



#### 박시원

> print("Hello World")



#### 이현정

> ddd



#### 안성진

> ㅇㅇㅇ



#### 강정현

> ㅇㅇㅇ



#### 김주연

> ddd
