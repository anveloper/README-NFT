/**
 * PJT Ⅰ - 과제 3 테스트 코드 작성
 * @dev NFT mint, transfer, and compare URI 
 */
const NftFactory = artifacts.require("NftFactory");

contract("NftFactory", (accounts) => {
  it("NFT mint, transfer, and compare URI", async () => {

    const NftFactory = await NftFactorys.deployed();
    
    // 민팅 테스트
    let newTokenId = (await NftFactory.create(accounts[0], "URI 1")).receipt.logs[0].args.tokenId.toNumber();
    let owner = await NftFactory.ownerOf(newTokenId);
    
    assert.equal(accounts[0], owner, "NFT Mint Failed");

    // 전송 테스트
    await NftFactory.transferFrom(accounts[0], accounts[1], newTokenId);
    await NftFactory.ownerOf(newTokenId).then((result) => {
      owner = result;
    });
    assert.equal(accounts[1], owner, "NFT Transfer Failed");

    // 메타데이터 출력 테스트
    let tokenURI = await NftFactory.tokenURI(newTokenId);
    assert.equal("URI 1", tokenURI, "Wrong Token Id or URI");
  });
});