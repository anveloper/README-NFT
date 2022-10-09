# 🖼놀면서 만드는 NFT, README 



## 🚀프로젝트 소개

> #### 사용자 간 그림 퀴즈를 맞추고 NFT화하는 서비스, 내 마음을 읽어줘 README!

![image](https://user-images.githubusercontent.com/93081720/192415599-63bd6f79-1c10-4bbd-894a-0b5cf56767d3.png)

![image](https://user-images.githubusercontent.com/93081720/192415675-d77d49ac-25d9-487a-9e5d-6975a9a09d18.png)

<br>

### 🤔기획 의도

> #### 내가 그린 재미있는 그림을 NFT화해서 창시자로 인정받고, 소유하거나 거래할 수 있다면 재미있지 않을까?

- 기존 NFT는 생성 및 거래 과정이 어렵고 불편함
- 생성/거래만 있는 NFT가 아닌, 게임과 소통을 통한 NFT 발급
- 말로만 듣던 NFT를 경험하고 싶은 욕구
- 내가 직접 만든 나만의 NFT를 생성하여 가지고 싶은 욕구

<br>

### 🎯서비스 대상

NFT에 관심을 갖고 있으면서 게임을 좋아하는 젊은 세대 및 연령층

<br>

### 🎨 UI/UX

누구나 가벼운 분위기로 그림 맞추기 게임을 즐길 수 있는 만큼 아기자기한 디자인을 채택함

<br>

### 📅일정

> #### 22.08.22(월) ~ 22.10.07(금) (총 7주)

- 기획 및 설계 : 08.22 ~ 09.08 (2.5주)
  - 기획 : 프로젝트 아이디어 논의, 주제 구체화, 기술 스택 선정
  - 설계 : 기능 요구 명세서 작성, ERD, 와이어프레임, 프로젝트 구조 설계, REST API 설계
- 개발 : 09.08 ~ 09.30 (3.5주)
  - API 구현
  - 프로젝트 주요 기능 구현
  - 스마트 컨트랙트 작성
  - 블록체인 네트워크 연동
  - 배포 및 인프라 구축
- 테스트 및 유지보수 : 10.03 ~ 10.07 (1주)
  - 통합 테스트
  - 오류 수정
  - 산출물 정리

![image](https://user-images.githubusercontent.com/93081720/192416186-55efe735-b827-4215-8ce3-9e6c9f45aaee.png)

<br>

## 🔍프로젝트 정보
- [설계 산출물](/exec/설계%20산출물/설계%20산출물.md)
  - [기능명세서](/exec/설계%20산출물/기능명세서.pdf)
  - [ERD](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/981982d4-ddfe-41fd-a45c-6941d20af78b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220929%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220929T043406Z&X-Amz-Expires=86400&X-Amz-Signature=0723c4bb4d1bafde91e4f219a34ad31995386ac1341f0e0119470e3ed957d389&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)
  - [API](/exec/설계%20산출물/API%20DOC.pdf)
  - 와이어 프레임

- [배포 메뉴얼](/exec/배포%20메뉴얼.md)
- [실행 메뉴얼](/exec/실행%20메뉴얼.md)

<br>

### 🛠기술 스택
기술 스택
![기술스택](https://user-images.githubusercontent.com/93081720/194449646-76222862-49ac-4b32-8af8-d8ed6cffb20a.png)

<br>

## ⭐프로젝트 특징 및 기능

### 🎞주요 구현 기능

#### 웰컴 페이지

![웰컴 페이지](/exec/images/README%20welcome.gif)

<br>

#### 네트워크 가이드

![네트워크 가이드](/exec/images/README%20network%20guide.gif)

<br>

#### 퀴즈

![네트워크 가이드](/exec/images/README%20quiz.gif)

<br>

#### 라이브 드로잉 게임

![네트워크 가이드](/exec/images/README%20game.gif)

<br>

#### 마이 페이지

![네트워크 가이드](/exec/images/README%20mypage.gif)

<br>

#### NFT 판매

![네트워크 가이드](/exec/images/README%20sale.gif)

<br>

#### NFT 마켓

![네트워크 가이드](/exec/images/README%20market.gif)

<br>

## 🤝팀 소개

### 🙋‍♂️🙋‍♀️구성원 및 담당 역할

#### 🛰BE/SC

| 이름 | 개발 내용 |
| ------ | ------------ |
|[👨🏻‍💻 김우원](https://github.com/woowonKim) [📧](mailto:dyffh1031@naver.com)        | Spring Boot REST API<br />EC2 IPFS 설정, IPFS를 통한 NFT 메타데이터 저장<br />web3.js와 메타 마스크를 이용한 스마트 컨트랙트 호출 및 계정 관리 |
|[👨🏻‍💻 박시원](https://github.com/siwon-park) [📧](mailto:zow777@naver.com)   | Spring Boot REST API<br />젠킨스와 도커를 활용한 CI/CD |
|[👩🏻‍💻 이현정](https://github.com/lhynjn9) [📧](mailto:hyjei10@gmail.com)        | Spring Boot REST API<br />기본 민팅, 배치 민팅, 거래 스마트 컨트랙트 구현<br />Hashlips art engine를 이용한 배치 민팅용 조합 이미지 생성 |



#### 🌈FE

| 이름 | 개발 내용 |
| ------ | ------------ |
|[👨🏻‍💻 안성진](https://github.com/anveloper) [📧](mailto:hitedin@gmail.com) | React, TypeScript, Socket.io(client, server)<br />웹소켓 게임 기능<br />메인페이지(라이브, NFT목록) 전체 구현 |
|[👩🏻‍💻 강정현](https://github.com/taboowiths) [📧](mailto:jhkang9820@gmail.com)   | React, TypeScript<br />웹사이트 전체 디자인 및 UI/UX 기획<br />NFT 상세페이지, 판매 및 구매페이지, 마켓페이지 구성 |
|[👩🏻‍💻 김주연](https://github.com/Juuyeon) [📧](mailto:jyeon3930@naver.com) |React, Typescript<br />웹사이트 디자인 <br />웰컴페이지, 마이페이지 구현|



### ⚙팀 운영

|                             노션                             |                             Jira                             |                             Git                              |
| :----------------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image](https://user-images.githubusercontent.com/93081720/192472772-257048e0-0887-41fd-876c-324dbe90fb2d.png) | ![image](https://user-images.githubusercontent.com/93081720/192472638-9113553d-3605-4c7f-be19-5c731b3bcf66.png) | ![image](https://user-images.githubusercontent.com/93081720/192473023-5425c88a-4ff3-4342-8b95-dde5a5e4d501.png) |
|     노션 팀 페이지를 활용하여 매일 오전/오후 스크럼 진행     |      Jira를 활용한 전체 프로젝트 이슈 및 주간 이슈 관리      |       이슈 기반의 깃 브랜치 전략을 통한 프로젝트 관리        |



### ✒프로젝트 회고

#### 김우원

> 새로운 기술을 배우는 재미를 알게 되었다

처음 사용해보는 기술 스택을 공부하여 새로운 서비스를 개발하게 해준 아주 고마운 프로젝트였다.

IPFS, 이더리움, web3, 스마트 컨트랙트, ERC-721, ERC-20... 처음 접하는 기술들을 공식문서를 활용하여 학습하고, 구현하고자 하는 기능들을 구현함으로서 많은 보람을 느꼇다. 

특히, 아직은 일반인에게 아직 생소할 수 있는 web3.0 서비스를 사용자 입장에서 불편 없이 사용할 수 있도록 많은 고민과 노력을 하였다.



#### 박시원

> 조금 어려웠지만, 새로운 주제와 기술을 배울 수 있어서 좋았습니다

평소 해보고 싶었던 배포를 해볼 수 있어서 좋았습니다. 잘 몰라서 많은 트러블을 겪었지만, 그래도 포기하지 않고 도전한 결과 해낼 수 있어서 뿌듯했습니다.

생각했던 것보다 팀원들을 많이 못 도와준 것 같아 아쉬움도 남습니다.

테스트 코드를 짜는데 너무 많은 시간을 투자한 바람에 기술적으로 많은 성장은 하지 못했지만, 블록체인과 스마트 컨트랙트에 대해 학습한 내용이 있어서 보람은 느낍니다.



#### 이현정

> 좋은 팀원들을 만나서 행복 코딩 했습니다

NFT를 주제로 한 프로젝트를 진행하면서 새로운 기술을 많이 배우게 되었습니다. 그 중에서도 스마트 컨트랙트에 대한 부분을 맡게 되었습니다. 솔리디티라는 새로운 언어로 개발을 진행했습니다. 원래 관심있던 분야의 프로젝트여서 어렵지만 재밌게 작업을 하였습니다.



#### 안성진

> Typescript 덕분에 프론트가 더 재미있어졌습니다. 코딩 정말 재미있네요.

잔잔하게 재미있는 팀원들을 만나서 즐거웠습니다. 충돌없이 맡은 일에 최선을 다하는 팀원들이 믿음직 스러웠습니다.



#### 강정현

> 사람 좋은 NFTeam, 덕분에 즐거운 경험 + 1

새로운 기술을 접하는 것에 있어 어려웠던 순간은 있었지만, 좋은 팀원들을 만나 재미있게 참여할 수 있었습니다. 어려운 문제가 있어 도움을 요청하면 언제든지 같이 고민해주고, 해결 방안을 생각해주는 우리 NFTeam 팀원들! 덕분에 정말 많은 것을 배울 수 있었습니다. 너무 감사해요 ! 영원히 함께해요. ☺



#### 김주연

> 최고의 팀원들 + 멋진 프로젝트 = NFTeam!!!

블록체인 프로젝트를 하며 새로운 기술도 많이 배우고, 성장했습니다. 문제가 발생해도 함께 고민하고 해결해주는 좋은 팀원들 덕분에 끝까지 잘 마무리 할 수 있었습니다! 7주간 프로젝트 하느라 다들 고생 많으셨습니다~!
