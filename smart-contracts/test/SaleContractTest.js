//const Migrations = artifacts.require("Migrations");
const MintReadme = artifacts.require("MintReadmeToken");
const SaleReadme = artifacts.require("SaleReadmeToken");
const GetReadme = artifacts.require("GetReadmeToken");
const Draw = artifacts.require("DrawToken");
const Ssafy = artifacts.require("SsafyToken");

contract("Testing", (accounts) => {
  it("민팅 후 거래", async () => {
    console.log("<<<시나리오 1>>>");
    // 민팅 매개변수
    const admin = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];
    // 컨트랙트 인스턴스
    const MintReadmeContract = await MintReadme.new();
    const SaleReadmeContract = await SaleReadme.new(MintReadmeContract.address);
    const create_tx = await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    const tokenId = await MintReadmeContract.totalSupply();
    const owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const mytokenId = await MintReadmeContract.getOwnedTokens(seller);
    console.log("=================== Seller의 민팅 =================");
    console.log("MintContract: ", MintReadmeContract.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("tokenId: ", tokenId.words[0]);
    assert.equal(seller, owner, "Seller is Not Onwer");
    console.log("seller: ", seller);
    console.log("owner: ", owner);
    console.log("Approvals owner: ", create_tx.logs[1].args.owner);
    console.log("operator(SaleContract): ", create_tx.logs[1].args.operator);
    console.log("Seller Token: ", mytokenId);
    console.log("=================== Seller의 판매 등록 =================");
    const sale_tx = await SaleReadmeContract.setForSaleReadmeToken(
      tokenId.words[0],
      1,
      60000,
      { from: seller }
    );
    const onSale = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", onSale);
    console.log("================ Buyer의 구매를 위한 토큰 발행 =============");
    // buyer의 지갑 인스턴스
    const SsafyContract = await Ssafy.new("SSAFY", "SSF", { from: buyer });
    await SsafyContract.mint(10000000, { from: buyer });
    const buyser_bal = await SsafyContract.balanceOf(buyer);
    console.log("buyer: ", buyer);
    console.log("SsafyContract.address: ", SsafyContract.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("buyer 잔액: ", buyser_bal.words[0]);
    console.log(
      "=================== Buyer의 구매 후, 소유주 및 잔액 확인================="
    );
    // 권한 부여
    await SsafyContract.approve(SaleReadmeContract.address, 100, {
      from: buyer,
    });
    const how = await SsafyContract.allowance(
      buyer,
      SaleReadmeContract.address
    );
    console.log("지갑이 판매 계약에 사용 승인한 금액: ", how.words[0]);
    await SaleReadmeContract.purchaseReadmeToken(
      SsafyContract.address,
      tokenId.words[0],
      { from: buyer }
    );
    const new_owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const buytokenId = await MintReadmeContract.getOwnedTokens(buyer);
    const selltokenId = await MintReadmeContract.getOwnedTokens(seller);
    const buyser = await SsafyContract.balanceOf(buyer);
    console.log("seller: ", seller);
    console.log("buyer: ", buyer);
    console.log("owner: ", new_owner);
    console.log("buyer 잔액: ", buyser.words[0]);
    console.log("구매자 토큰 리스트: ", buytokenId);
    console.log("판매자 토큰 리스트: ", selltokenId);
  });
  it("구매한 NFT 재판매", async () => {
    console.log("<<<시나리오 2>>>");
    // 민팅 매개변수
    const admin = accounts[0];
    const seller = accounts[1];
    const buyer1 = accounts[2];
    const buyer2 = accounts[3];
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];
    // 컨트랙트 인스턴스
    const MintReadmeContract = await MintReadme.new();
    const SaleReadmeContract = await SaleReadme.new(MintReadmeContract.address);
    const create_tx = await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    const tokenId = await MintReadmeContract.totalSupply();
    const owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const mytokenId = await MintReadmeContract.getOwnedTokens(seller);
    console.log("=================== Seller의 민팅 =================");
    console.log("MintContract: ", MintReadmeContract.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("tokenId: ", tokenId.words[0]);
    assert.equal(seller, owner, "Seller is Not Onwer");
    console.log("seller: ", seller);
    console.log("owner: ", owner);
    console.log("Approvals owner: ", create_tx.logs[1].args.owner);
    console.log("operator(SaleContract): ", create_tx.logs[1].args.operator);
    console.log("Seller Token: ", mytokenId);
    console.log("=================== Seller의 판매 등록 =================");
    const sale_tx = await SaleReadmeContract.setForSaleReadmeToken(
      tokenId.words[0],
      1,
      60000,
      { from: seller }
    );
    const onSale = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", onSale);
    console.log(
      "================ Buyer1의 구매를 위한 토큰 발행 ============="
    );
    // buyer의 지갑 인스턴스
    const SsafyContract = await Ssafy.new("SSAFY", "SSF", { from: buyer1 });
    await SsafyContract.mint(10000000, { from: buyer1 });
    const buyser_bal = await SsafyContract.balanceOf(buyer1);
    console.log("buyer1: ", buyer1);
    console.log("SsafyContract.address: ", SsafyContract.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("buyer1 잔액: ", buyser_bal.words[0]);
    console.log(
      "=================== buyer1의 구매 후, 소유주 및 잔액 확인================="
    );
    // 권한 부여
    await SsafyContract.approve(SaleReadmeContract.address, 100, {
      from: buyer1,
    });
    const how = await SsafyContract.allowance(
      buyer1,
      SaleReadmeContract.address
    );
    console.log("지갑이 판매 계약에 사용 승인한 금액: ", how.words[0]);
    await SaleReadmeContract.purchaseReadmeToken(
      SsafyContract.address,
      tokenId.words[0],
      { from: buyer1 }
    );
    const new_owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const buytokenId = await MintReadmeContract.getOwnedTokens(buyer1);
    const selltokenId = await MintReadmeContract.getOwnedTokens(seller);
    const buyer1_bal = await SsafyContract.balanceOf(buyer1);
    console.log("seller: ", seller);
    console.log("buyer1: ", buyer1);
    console.log("owner: ", new_owner);
    console.log("buyer1 잔액: ", buyer1_bal.words[0]);
    console.log("구매자1 토큰 리스트: ", buytokenId);
    console.log("판매자 토큰 리스트: ", selltokenId);
    console.log("=================== buyer 1의 판매 등록 =================");
    await SaleReadmeContract.setForSaleReadmeToken(tokenId.words[0], 5, 60000, {
      from: buyer1,
    });
    const onSalebuyer = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", onSalebuyer);
    console.log(
      "================ Buyer2의 구매를 위한 토큰 발행 ============="
    );
    // buyer의 지갑 인스턴스
    const SsafyContract2 = await Ssafy.new("SSAFY", "SSF", { from: buyer2 });
    await SsafyContract2.mint(55555, { from: buyer2 });
    const buy2_bal = await SsafyContract2.balanceOf(buyer2);
    console.log("buyer2: ", buyer2);
    console.log("SsafyContract2.address: ", SsafyContract2.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("buyer2 잔액: ", buy2_bal.words[0]);
    console.log(
      "=================== Buyer2의 구매 후, 소유주 및 잔액 확인================="
    );
    // 권한 부여
    await SsafyContract2.approve(SaleReadmeContract.address, 100, {
      from: buyer2,
    });
    const how2 = await SsafyContract2.allowance(
      buyer2,
      SaleReadmeContract.address
    );
    console.log("지갑이 판매 계약에 사용 승인한 금액: ", how2.words[0]);
    await SaleReadmeContract.purchaseReadmeToken(
      SsafyContract2.address,
      tokenId.words[0],
      { from: buyer2 }
    );
    const new_owner2 = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const buytokenId1 = await MintReadmeContract.getOwnedTokens(buyer1);
    const buytokenId2 = await MintReadmeContract.getOwnedTokens(buyer2);
    const buyer1_bal1 = await SsafyContract.balanceOf(buyer1);
    const buyer1_bal2 = await SsafyContract2.balanceOf(buyer2);
    console.log("buyer1: ", buyer1);
    console.log("buyer2: ", buyer2);
    console.log("owner: ", new_owner2);
    console.log("buyer2 잔액: ", buyer1_bal2.words[0]);
    console.log("구매자1(판매자) 토큰 리스트: ", buytokenId1);
    console.log("구매자2 토큰 리스트: ", buytokenId2);
  });
  it("구매 등록 취소", async () => {
    console.log("<<<시나리오 3>>>");
    // 민팅 매개변수
    const admin = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    const uri = "NFT Metadata"; // 생성할 토큰 메타데이터
    const answer = "Hyeon";
    const solver = accounts[7];
    // 컨트랙트 인스턴스
    const MintReadmeContract = await MintReadme.new();
    const SaleReadmeContract = await SaleReadme.new(MintReadmeContract.address);
    const create_tx = await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    await MintReadmeContract.create(
      uri,
      SaleReadmeContract.address,
      answer,
      solver,
      { from: seller }
    );
    const tokenId = await MintReadmeContract.totalSupply();
    const owner = await MintReadmeContract.ownerOf(tokenId.words[0]);
    const mytokenId = await MintReadmeContract.getOwnedTokens(seller);
    console.log("=================== Seller의 민팅 =================");
    console.log("MintContract: ", MintReadmeContract.address);
    console.log("SaleContract: ", SaleReadmeContract.address);
    console.log("tokenId: ", tokenId.words[0]);
    assert.equal(seller, owner, "Seller is Not Onwer");
    console.log("seller: ", seller);
    console.log("owner: ", owner);
    console.log("Approvals owner: ", create_tx.logs[1].args.owner);
    console.log("operator(SaleContract): ", create_tx.logs[1].args.operator);
    console.log("Seller Token: ", mytokenId);
    console.log("=================== Seller의 판매 등록 =================");
    const sale_tx = await SaleReadmeContract.setForSaleReadmeToken(
      tokenId.words[0],
      1,
      6000000,
      { from: seller }
    );
    const onSale = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", onSale);
    console.log("================ Seller의 판매 등록 취소 =============");
    await SaleReadmeContract.cancelReadmeToken(tokenId.words[0], {
      from: seller,
    });
    const nowSale = await SaleReadmeContract.getOnSaleReadmeToken();
    console.log("OnSale List: ", nowSale);
  });
});
