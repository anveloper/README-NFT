//const Migrations = artifacts.require("Migrations");
const MintReadme = artifacts.require("MintReadmeToken");
const SaleReadme = artifacts.require("SaleReadmeToken");
const GetReadme = artifacts.require("GetReadmeToken");
const Draw = artifacts.require("DrawToken");
const Ssafy = artifacts.require("SsafyToken");


contract("Testing", (accounts) => {
  const mintAmount = 10000; // 초기 토큰

  console.log('===================시나리오 1=================')

  it("MintSale", async () => {

    // 민팅 매개변수
    const admin = accounts[0]
    const seller = accounts[1];
    const buyer = accounts[2]; // 나
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];

    // 컨트랙트 인스턴스
    const MintReadmeContract = await MintReadme.new();
    const SaleReadmeContract = await SaleReadme.new(MintReadmeContract.address);
    
    // buyer의 지갑 인스턴스
    const SsafyContract = await Ssafy.new("SSAFY", "SSF", {from: buyer});

    const create_tx = await MintReadmeContract.create(
      uri, 
      SaleReadmeContract.address, 
      answer, 
      solver,
      {from: seller});

    await MintReadmeContract.create(
      uri, 
      SaleReadmeContract.address, 
      answer, 
      solver,
      {from: seller});

    const tokenId = await MintReadmeContract.totalSupply();
    const owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const mytokenId = await MintReadmeContract.getOwnedTokens(seller);

    console.log('=================== Seller의 민팅 =================')
    console.log("SaleContract: ", SaleReadmeContract.address)
    console.log("tokenId: ", tokenId.words[0])
    assert.equal(seller, owner, "Seller is Not Onwer")
    console.log("seller: ", seller);
    console.log("owner: ", owner);
    console.log("Approvals owner: ", create_tx.logs[1].args.owner);
    console.log("operator(SaleContract): ", create_tx.logs[1].args.operator);
    console.log("Seller Token: ", mytokenId)

    console.log('=================== Seller의 판매 등록 =================')
    
    const sale_tx = await SaleReadmeContract.setForSaleReadmeToken(
      tokenId.words[0],
      1,
      60000,
      {from: seller}
    );

    const onSale = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", onSale);

    console.log('=================== Buyer의 구매를 위한 토큰 발행 =================')
    
    await SsafyContract.mint(10000000, {from: buyer})

    const buyser_bal = await SsafyContract.balanceOf(buyer);

    console.log("buyer 잔액: ", buyser_bal.words[0]); 
    console.log("SsafyContract.address: ", SsafyContract.address)

    // 토큰 구매를 위해 buyer의 지감에 토큰을 전송
    const wallet_tx = await SsafyContract.forceToTransfer(
      buyer,
      SsafyContract.address,
      50000,
      {from: buyer}
    );

    const wallet_bal = await SsafyContract.balanceOf(SsafyContract.address);

    console.log("지갑 잔액: ", wallet_bal.words[0]);

    console.log('=================== Buyer의 구매 =================')

    const walletAddress = SsafyContract.address;

    await SaleReadmeContract.purchaseReadmeToken(
      SsafyContract,
      tokenId.words[0],
      {from: buyer}
    );

    console.log(purchase);


  });

  console.log('===================시나리오2=================')
  it("Bid and Purchase", async () => {
    // const seller = accounts[0];
    // const bidder = accounts[1];
    // const purchaser = accounts[2];
  });

  it("Bid and Cancel", async () => {
    // const seller = accounts[0];
    // const bidder = accounts[1];
  });
});
