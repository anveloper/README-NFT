## Guide for Testing Smart Contracts
<br/>

### Prerequisites

```bash
$ npm install -g truffle
$ npm i
```

<br/>

### ```truffle-config.js``` 설정

<br/>
아래 부분을 테스트 환경에 맞게 변경

```js
module.exports = {
  networks: {
     development: {
      host: "127.0.0.1",    
      port: 7545,           
      network_id: "*",    
     },
     ...
  }
}
```

위 --network 옵션을 지정하지 않고 truffle test 실행  시, "development"를 기본으로 지정함.

```bash
$ truffle test --network <network-name>
```
<br/>

### 기본 사용법

```bash
$ truffle compile # 컨트랙트 컴파일
$ truffle migrate # 컨트랙트 배포
$ truffle test # 컨트랙트 테스트
```


#### 테스트 코드 실행 예

```bash
$ truffle test ./test/NFTCreateorTest.js
$ truffle test ./test/SaleTest.js
```

<br/>
<br/>

### IPFS 설치

[Command-line | IPFS Docs](https://docs.ipfs.tech/install/command-line/#which-node-should-you-use-with-the-command-line)

### IPFS CORS

```bash
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '[\\"*\\"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '[\\"PUT\\", \\"GET\\", \\"POST\\"]'
ipfs daemon //ifps 실행
```

### 웹에서 파일 올리기

1. ipfs-api 설치

```bash
npm install ipfs-api
```

1. 파일을 Buffer로 변환 후 업로드(ipfs-http-client를 사용하면 이 과정이 자동화 되는거 같음…)

   ```
   import IpfsAPI from "ipfs-api";
   import { Buffer } from "buffer";
   
   const addItem = async () => {
       // TODO
       const fr = new FileReader();
       var ipfs = IpfsAPI("/ip4/127.0.0.1/tcp/5001");
       fr.readAsArrayBuffer(item);// file to arrayBuffer
       fr.onload = () => {
         ipfs.files.add(Buffer.from(fr.result), (err, res) => {//arrayBuffer를 buffer로 변환 후 업로드
           if (err) {
             console.log(err);
             return;
           }
           console.log(res);
         });
       };
       
     };
   ```

   ipfs-http-client 사용시 코드(명세 스켈레톤 코드에서 해당 모듈이 작동을 안한다…)

   ```jsx
   import { create } from "ipfs-http-client";
   
   const client = create({ url: "<http://127.0.0.1:5001/api/v0>" });
   
     const addFile = async () => {
       console.log(item);
       const { cid } = await client.add(item);
       console.log(cid);
     };
   ```

### truffle migrate

- —network 옵션이 없는 경우 truffle-config.js의 development를 기반으로 배포

truffle-config.js example

```jsx
networks: {
  development: {
    host: "127.0.0.1",
    port: 8545,
    network_id: "*", // match any network
    websockets: true
  },
  live: {
    host: "178.25.19.88", // Random IP for example purposes (do not use)
    port: 80,
    network_id: 1,        // Ethereum public network
    // optional config values:
    // gas                  - use gas and gasPrice if creating type 0 transactions
    // gasPrice             - all gas values specified in wei
    // maxFeePerGas         - use maxFeePerGas and maxPriorityFeePerGas if creating type 2 transactions (<https://eips.ethereum.org/EIPS/eip-1559>)
    // maxPriorityFeePerGas -
    // from - default address to use for any transaction Truffle makes during migrations
    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - function that returns a web3 provider instance (see below.)
    //          - if specified, host and port are ignored.
    // production: - set to true if you would like to force a dry run to be performed every time you migrate using this network (default: false)
    //             - during migrations Truffle performs a dry-run if you are deploying to a 'known network'
    // skipDryRun: - set to true if you don't want to test run the migration locally before the actual migration (default: false)
    // confirmations: - number of confirmations to wait between deployments (default: 0)
    // timeoutBlocks: - if a transaction is not mined, keep waiting for this number of blocks (default: 50)
    // deploymentPollingInterval: - duration between checks for completion of deployment transactions
    // networkCheckTimeout: - amount of time for Truffle to wait for a response from the node when testing the provider (in milliseconds)
    //                      - increase this number if you have a slow internet connection to avoid connection errors (default: 5000)
    // disableConfirmationListener: - set to true to disable web3's confirmation listener
  }
}
```

궁금사항

1. chain id ?= network _d
2. provider?

### RPC란

Remote Procedure Call의 약자로 원격제어를 위한 코딩 없이 다른 주소 공간에서 함수나 프로시저를 실행할 수 있게 하는 프로세스 간 통신 기술이다.

함수 : Input에 따른 Output 발생, 즉 Return 값에 집중

프로시저 : Return 값에 집중하는게 아닌 ‘명령 단위가 수행하는 절차’에 집중

즉, 블록체인에 배포된 스마트 컨트랙트를 RPC API를 통해 호출

### RPC 요청

ganache로 test 블록체인 네트워크를 실행하면, RPC요청을 할 수 있는 URL이 생성된다

```jsx
RPC Listening on 127.0.0.1:8545 
```

### Gas 관련

truffle migrate를 통해 배포 시 block limit이 나타난다.

```jsx
Starting migrations...
======================
> Network name:    'development'
> Network id:      1663399578971
> Block gas limit: 30000000 (0x1c9c380)
```

배포된 컨트렉트로 발생하는 최대 가스는 30000000 이고 이를 초과하는 요청 발생시 다음과 같은 에러가 발생한다.

```jsx
"SsafyNFT" exceeded the block limit (with a gas value you set).
```

- gas 관련 에러

web3 요청 코드

```jsx
let createToken = new web3.eth.Contract(
              COMMON_ABI.CONTRACT_ABI.NFT_ABI,
              "0x5868f886edf0daa0d33d45aD7e727EA4723c0fCB",
              {
                from: getAddressFrom(privKey),
              }
            );
createToken.methods
  .create(getAddressFrom(privKey), tokenURI)
  .send();
```

발생 에러

```jsx
Transaction: 0xf7fd6a173b3c35e2a11e32676859204666252d6886053fbdfac9d68599d59098
Gas usage: 90000
Block number: 3
Block time: Sat Sep 17 2022 17:26:11 GMT+0900 (대한민국 표준시)
Runtime error: out of gas
```

이유 : 위 Web3에서 제공한 gas가 90000인데 transaction이 완료되기전에 모든 gas 소진…

해결

```jsx
let createToken = new web3.eth.Contract(
              COMMON_ABI.CONTRACT_ABI.NFT_ABI,
              "0x5868f886edf0daa0d33d45aD7e727EA4723c0fCB",
              {
                from: getAddressFrom(privKey),
                gas: 30000000,
              }
            );
createToken.methods
  .create(getAddressFrom(privKey), tokenURI)
  .send();
```

- gas provided 설정

```jsx
Transaction: 0x6c4f9b12dece9555f645ecf4501f929d37baf13d7929d528ffed9eadbb2aeeec
Gas usage: 183002
Block number: 4
Block time: Sat Sep 17 2022 18:04:27 GMT+0900 (대한민국 표준시)
```

- send에 옵션으로 제공할 가스값도 설정 가능
  - gas : maximun gas provided 값 설정 (gas limit)
  - gas price : gas 가격(단위 wei)

### gas?

gas limit : 사용할 가스에 대한 예상치, 너무 높을 시 거절 당할 수 있음( exceeded the block limit) 너무 낮으면 out of gas 발생 (남는 수치는 돌려줌)

gas price : gas limit에서 1gas당 가격, 높을 수록 빨리 실행

총 비용 : gas limit * gas priceRPC란

Remote Procedure Call의 약자로 원격제어를 위한 코딩 없이 다른 주소 공간에서 함수나 프로시저를 실행할 수 있게 하는 프로세스 간 통신 기술이다.

함수 : Input에 따른 Output 발생, 즉 Return 값에 집중

프로시저 : Return 값에 집중하는게 아닌 ‘명령 단위가 수행하는 절차’에 집중

즉, 블록체인에 배포된 스마트 컨트랙트를 RPC API를 통해 호출

### RPC 요청

ganache로 test 블록체인 네트워크를 실행하면, RPC요청을 할 수 있는 URL이 생성된다

```jsx
RPC Listening on 127.0.0.1:8545 
```

### Gas 관련

truffle migrate를 통해 배포 시 block limit이 나타난다.

```jsx
Starting migrations...
======================
> Network name:    'development'
> Network id:      1663399578971
> Block gas limit: 30000000 (0x1c9c380)
```

배포된 컨트렉트로 발생하는 최대 가스는 30000000 이고 이를 초과하는 요청 발생시 다음과 같은 에러가 발생한다.

```jsx
"SsafyNFT" exceeded the block limit (with a gas value you set).
```

- gas 관련 에러

web3 요청 코드

```jsx
let createToken = new web3.eth.Contract(
              COMMON_ABI.CONTRACT_ABI.NFT_ABI,
              "0x5868f886edf0daa0d33d45aD7e727EA4723c0fCB",
              {
                from: getAddressFrom(privKey),
              }
            );
createToken.methods
  .create(getAddressFrom(privKey), tokenURI)
  .send();
```

발생 에러

```jsx
Transaction: 0xf7fd6a173b3c35e2a11e32676859204666252d6886053fbdfac9d68599d59098
Gas usage: 90000
Block number: 3
Block time: Sat Sep 17 2022 17:26:11 GMT+0900 (대한민국 표준시)
Runtime error: out of gas
```

이유 : 위 Web3에서 제공한 gas가 90000인데 transaction이 완료되기전에 모든 gas 소진…

해결

```jsx
let createToken = new web3.eth.Contract(
              COMMON_ABI.CONTRACT_ABI.NFT_ABI,
              "0x5868f886edf0daa0d33d45aD7e727EA4723c0fCB",
              {
                from: getAddressFrom(privKey),
                gas: 30000000,
              }
            );
createToken.methods
  .create(getAddressFrom(privKey), tokenURI)
  .send();
```

- gas provided 설정

```jsx
Transaction: 0x6c4f9b12dece9555f645ecf4501f929d37baf13d7929d528ffed9eadbb2aeeec
Gas usage: 183002
Block number: 4
Block time: Sat Sep 17 2022 18:04:27 GMT+0900 (대한민국 표준시)
```

- send에 옵션으로 제공할 가스값도 설정 가능
  - gas : maximun gas provided 값 설정 (gas limit)
  - gas price : gas 가격(단위 wei)

### gas?

gas limit : 사용할 가스에 대한 예상치, 너무 높을 시 거절 당할 수 있음( exceeded the block limit) 너무 낮으면 out of gas 발생 (남는 수치는 돌려줌)

gas price : gas limit에서 1gas당 가격, 높을 수록 빨리 실행

총 비용 : gas limit * gas price
