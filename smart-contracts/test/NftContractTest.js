/**
 * PJT Ⅰ - 과제 3 테스트 코드 작성
 * @dev NFT mint, transfer, and compare URI 
 */
const NftCreator = artifacts.require("ReadmeToken");

contract("NftCreator", (accounts) => {
  it("NFT mint, transfer, and compare URI", async () => {

    const ReadmeToken = await NftCreator.deployed();
    
    // 민팅 테스트
    let newTokenId = (await ReadmeToken.create(accounts[0], "URI 1")).receipt.logs[0].args.tokenId.toNumber();
    let owner = await ReadmeToken.ownerOf(newTokenId);
    
    assert.equal(accounts[0], owner, "NFT Mint Failed");

    // 전송 테스트
    await ReadmeToken.transferFrom(accounts[0], accounts[1], newTokenId);
    await ReadmeToken.ownerOf(newTokenId).then((result) => {
      owner = result;
    });
    assert.equal(accounts[1], owner, "NFT Transfer Failed");

    // 메타데이터 출력 테스트
    let tokenURI = await ReadmeToken.tokenURI(newTokenId);
    assert.equal("URI 1", tokenURI, "Wrong Token Id or URI");
  });
});