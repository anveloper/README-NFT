// 상호작용할 계약을 truffle에게 알리는 역할
const SsafyToken = artifacts.require("SsafyToken");
const ReadmeToken = artifacts.require("ReadmeToken");
const SaleFactory = artifacts.require("SaleFactory");

 let ssafyTokenContract, salesFactoryContract, nftContract, salesContract;
 let itemId = 0;
 
 contract("Sale Contract Testing", (accounts) => {
     const mintAmount = 10000; // 초기 토큰
     
     // 테스트 계정 생성
     const uri1 = "testURI1";
     const uri2 = "testURI2";
 
     async function print(title) {
        const admin = accounts[0];
        const seller = accounts[1];
        const bidder1 = accounts[2];
        const bidder2 = accounts[3];
        console.log(`\n--------------------  ${title} --------------------`);
        console.log(`Admin: ${admin} ${await getBalance(seller)}`);
        console.log(`Seller: ${seller} ${await getBalance(seller)}`);
        console.log(`Bidder1: ${bidder1} ${await getBalance(bidder1)}`);
        console.log(`Bidder2: ${bidder2} ${await getBalance(bidder2)}\n`);
     }
     
     // SaleFactory -> Sale: bid(경매) -> confirmItem
     // SaleFactory -> Sale: bid(즉시구매) -> purchase
     // SaleFactory -> Sale: bid(즉시구매) -> purchase
     // SaleFactory -> Sale -> cancel
     it("Bid and confirm", async () => {
        const admin = accounts[0]; // 나
        const seller = accounts[1];
        const bidder1 = accounts[2];
        const bidder2 = accounts[3]; // purchaser
        const uri = "NFTTest";

        // createSale 인자
        let Item;
        let startPrice;
        let startTime;
        let endTime;
        let saleType;
        let currencyAddress;

        // 배포
        const SsafyTokenContract = await SsafyToken.deployed();
        const ReadmeTokenContract = await ReadmeToken.deployed();
        const SaleFactoryContract = await SaleFactory.deployed();

        // 시간 제한 함수
        function timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        
        // 초기 ERC20 토큰 부여
        await SsafyTokenContract.mint(100000, { from: admin }); // 호출자(나)에게 100000 민팅
        // 관리자가 각각 1000 토큰씩 부여
        await SsafyTokenContract.forceToTransfer(admin, seller, 1000, { from: admin });
        await SsafyTokenContract.forceToTransfer(admin, bidder1, 1000, { from: admin });
        await SsafyTokenContract.forceToTransfer(admin, bidder2, 1000, { from: admin });

        // seller 의 NFT 생성
        await ReadmeTokenContract.create(seller, uri, { from: seller });
        // 현재 토큰 번호
        Item = await ReadmeTokenContract.current();
        // tokenNo => BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }
        Item = Item.words[0];

        // 계약을 진행할 contract 
        currencyAddress = SsafyTokenContract.address;
        nftAddress = ReadmeTokenContract.address;

        // 시작 시간
        startTime = new Date();
        startTime = parseInt(startTime.getTime() / 1000); //  초단위로 변환
        // 종료 시간 : + 10초
        endTime = startTime + 10;
        // 입력 가격
        startPrice = 10;
        // 판매 타입
        saleType = false;

        // Sale Contract 생성
        await SaleFactoryContract.createSale(
            Item,
            startPrice,
            startTime,
            endTime,
            saleType,
            currencyAddress,
            nftAddress,
            { from: admin }
        );
        
        // 생성된 SaleContract 주소 반환
        const currentSale = await SaleFactoryContract.allSales(Item);

         // TODO
         // 다음을 테스트를 통과해야합니다.
         // assert.equal(bidder2, await getNftOwner(), "Confirm Failed");
         // assert.equal(1000, await getBalance(bidder1), "Refund Failed");
     });
 


     it("Bid and Purchase", async () => {
         const seller = accounts[0];
         const bidder = accounts[1];
         const purchaser = accounts[2];
 
         // TODO
         // 다음을 테스트를 통과해야합니다.
         // assert.equal(purchaser, await getNftOwner(), "Not Owned By Purchaser");
         // assert.equal(1000, await getBalance(bidder), "Refund Failed");
         // assert.equal(900, await getBalance(purchaser), "Transfer Failed");
     });
 
     it("Bid and Cancel", async () => {
         const seller = accounts[0];
         const bidder = accounts[1];
 
         // TODO
         // 다음을 테스트를 통과해야합니다.
         // assert.equal(seller, await getNftOwner(), "Cancellation Failed");
         // assert.equal(1000, await getBalance(bidder), "Refund Failed");
     });
 
 });
 