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
    const adming = accounts[0]
    const seller = accounts[1];
    const buyer = accounts[2]; // 나
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];

    // 컨트랙트 인스턴스
    const MintReadmeContract = await MintReadme.new();
    const SaleReadmeContract = await SaleReadme.new(MintReadmeContract.address);
    
    // buyer의 지갑 인스턴스
    const SsafyContract = await Ssafy.new("SSAFY", "SSF");

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
    const wallet_tx = await SsafyContract.mint(10000, {from: buyer})
    // console.log(wallet_tx)
    //const buy_tx = await SaleReadmeContract.purchaseReadmeToken();
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
