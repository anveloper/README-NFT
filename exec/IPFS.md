

# IPFS

### IPFS 설치

> 참고 : https://docs.ipfs.tech/install/command-line/#official-distributions

1. 바이너리 파일 다운로드

   ``` bash
   wget https://dist.ipfs.tech/kubo/v0.15.0/kubo_v0.15.0_linux-amd64.tar.gz
   ```

2. 압축 해제

   ```bash
   tar -xvzf kubo_v0.15.0_linux-amd64.tar.gz
   ```

3. run install script

   ```bash
   cd kubo/
   sudo bash install.sh 
   ```

### IPFS 실행

1. IPFS 실행 커맨드

   ```bash
   ipfs init
   
   IPFS daemon
   IPFS daemon & //background
   ```

2. 테스트 파일 생성

   ```
   vi test.html
   
   > <h2>hello world<h2/>
   ```

3. IPFS 업로드

   ```
   ipfs add test.txt 
   
   >added QmeV1kwh3333bsnT6YRfdCRrSgUPngKmAhhTa4RrqYPbKT test.txt
   ```

   - ipfs 완료 시 CID값이 나타난다.

4. IPFS에 업로드 된 파일 확인하기.

   - 퍼블릭 게이트웨이를 사용한다. (eg. ipfs.io)
     - [퍼블릭 게이트웨이 확인하기](https://ipfs.github.io/public-gateway-checker/)
   - URL : ipfs.io/ipfs/${CID}
   - 결과: ![image-20220923000414348](C:\Users\skycoms\AppData\Roaming\Typora\typora-user-images\image-20220923000414348.png)

5. ipfs daemon 계속 실행하기

   - ec2에 설치된 ipfs는 ssh를 종료하면 꺼지게 된다.
   - 레포지토리 폴더 생성 

   ``` bash
   mkdir /home/ubuntu/data/ipfs
   ```

   - IPFS path 추가하기
   
   ``` bash
   echo 'export IPFS_PATH=/home/ubuntu/ipfs/data' > ~/.profile
   source ~/.profile
   ```
   
   - IPFS 레포지토리 초기화
   
   ```bash
   ipfs init --profile server //provider.queue에러가 발생할 수 있는데 전혀 상관 없다고 한다.
   ```
   
   - systemctl 설정
   
   ```bash
   sudo nano /lib/systemd/system/ipfs.service
   ```
   
   ​	파일 내용
   
   ```
   [Unit]
   Description=ipfs daemon
   [Service]
   ExecStart=/usr/local/bin/ipfs daemon --enable-gc
   Restart=always
   User=ubuntu
   Group=ubuntu
   Environment="IPFS_PATH=/home/ubuntu/ipfs/data"
   [Install]
   WantedBy=multi-user.target
   ```
   
   ​	ec 인스턴스가 시작할때마다 실행되도록 설정
   
   - 실행하고 정상 작동하는지 확인하기
   
   ```bash
   sudo systemctl start ipfs
   sudo systemctl status ipfs
   ```

### IPFS 게이트웨이 설정

> 외부에서 IPFS 노드를 사용할 수 있도록

1. /home/ubuntu/ipfs/data의 config 수정

```bash
"API": "/ip4/0.0.0.0/tcp/5001",
"Gateway": "/ip4/0.0.0.0/tcp/8080"
...
"Gateway": {
    "HTTPHeaders": {
      "Access-Control-Allow-Headers": [
        "X-Requested-With",
        "Range",
        "User-Agent"
      ],
      "Access-Control-Allow-Methods": [
        "GET",
        "POST"
      ],
      "Access-Control-Allow-Origin": [
        "*"
      ]
    },
    "RootRedirect": "",
    "Writable": false,
    "PathPrefixes": [],
    "APICommands": [],
    "NoFetch": false,
    "NoDNSLink": false,
    "PublicGateways": null
  },
  "API": {
    "HTTPHeaders": {
      "Access-Control-Allow-Methods": [
        "PUT",
        "POST"
      ],
      "Access-Control-Allow-Origin": [
        "*"
      ]
    }
  },

```

2. ipfs 재시작 및 상태 확인

```bash
sudo systemctl restart ipfs
sudo systemctl status ipfs
```

```
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm listening on /p2p-circuit
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm announcing /ip4/127.0.0.1/tcp/4001
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm announcing /ip4/127.0.0.1/udp/4001/quic
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm announcing /ip4/34.198.166.0/udp/4001/quic
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm announcing /ip6/::1/tcp/4001
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Swarm announcing /ip6/::1/udp/4001/quic
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: API server listening on /ip4/0.0.0.0/tcp/5001
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: WebUI: http://127.0.0.1:5001/webui
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Gateway (readonly) server listening on /ip4/0.0.0.0/tcp/8080 //변경된 게이트웨이 확인
Sep 23 04:57:39 ip-172-31-87-41 ipfs[14954]: Daemon is ready
```

3. 5001포트 열기

```bash
sudo ufw allow 5001/tcp
```



