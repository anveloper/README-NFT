//const Migrations = artifacts.require("Migrations");
const MintReadme = artifacts.require("MintReadmeToken");
const SaleReadme = artifacts.require("SaleReadmeToken");
const GetReadme = artifacts.require("GetReadmeToken");
const Draw = artifacts.require("DrawToken");
const Ssafy = artifacts.require("SsafyToken");

// module.exports = async function (deployer) {
//   await deployer.deploy(MintReadme);
//   await deployer.deploy(SaleReadme, MintReadme.address);
//   await deployer.deploy(GetReadme, MintReadme.address, SaleReadme.address);
//   await deployer.deploy(
//     Draw,
//     "0x0c54E456CE9E4501D2c43C38796ce3F06846C966",
//     MintReadme.address,
//     SaleReadme.address
//   );
//   await deployer.deploy(Ssafy);
// };


let ssafyTokenContract, salesFactoryContract, nftContract, salesContract;
let itemId = 0;

contract("Minting And Sale Testing", (accounts) => {
  const mintAmount = 10000; // 초기 토큰

  console.log('===================ㅅㅣㄴㅏㄹㅣㅇㅗ 1=================')

  it("MintSale", async () => {

    // ㅁㅣㄴㅌㅣㅇㅁㅐㄱㅐㅂㅕㄴㅅㅜ
    const buyer = accounts[0]; // 나
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];

    // ㅋㅓㄴㅌㅡㄹㅐㄱㅌㅡ 배포
    const MintReadmeContract = await MintReadme.deployed();
    const SaleReadmeContract = await SaleReadme.deployed();
    
    // buyerㅇㅡㅣ ㅈㅣㄱㅏㅂ
    const SsafyContract = await Ssafy.deployed();


    // 시간 제한 함수
    function timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // 초기 ERC20 토큰 부여
    await SsafyTokenContract.mint(100000, { from: seller }); // 호출자(나)에게 100000 민팅

    // seller 의 NFT 생성
    await ReadmeTokenContract.create(uri, { from: seller });

    // 현재 토큰 번호
    itemId = await ReadmeTokenContract.current();

    // tokenNo => BN { negative: 0, words: [ 1, <1 empty item> ], length: 1, red: null }
    itemId = itemId.words[0];

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

    const firstowner = await ReadmeTokenContract.ownerOf(itemId);

    console.log("seller" + seller);
    console.log("firstowner" + firstowner);

    // 경매 등록
    const BidContract = await SaleContract.bid(
      seller,
      itemId,
      startPrice,
      startTime,
      endTime,
      currencyAddress,
      nftAddress,
      { from: seller }
    );

    // 경매 등록 후, 토큰 소유권 확인
    const finalowner = await ReadmeTokenContract.ownerOf(itemId);

    assert.equal(finalowner, BidContract, "Fail to TransferFrom");
  });

  console.log('===================ㅅㅣㄴㅏㄹㅣㅇㅗ 2=================')
  it("Bid and Purchase", async () => {
    const seller = accounts[0];
    const bidder = accounts[1];
    const purchaser = accounts[2];
  });

  it("Bid and Cancel", async () => {
    const seller = accounts[0];
    const bidder = accounts[1];
  });
});
