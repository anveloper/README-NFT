/**
 * PJT Ⅰ - 과제 3 테스트 코드 작성
 * @dev NFT mint, transfer, and compare URI
 */
const MintReadme = artifacts.require("MintReadmeToken");

contract("MintReadme", (accounts) => {
  it("NFT mint, transfer, and compare URI", async () => {
    const ReadmeToken = await MintReadme.deployed();

    // 민팅 테스트
    let TokenId = (
      await ReadmeToken.create("HI", { from: accounts[7] })
    ).receipt.logs[0].args.tokenId.toNumber();
    console.log(TokenId);

    let owner = await ReadmeToken.ownerOf(TokenId);
    console.log(owner);

    assert.equal(accounts[7], owner, "NFT Mint Failed");

    await ReadmeToken.tokenURI("1").then((result) => {
      meta = result;
    });
    console.log(meta);

    assert.equal("HI", meta, "Wrong Token Id or URI");

    await ReadmeToken.transferFrom(accounts[0], accounts[7], TokenId);

    await ReadmeToken.ownerOf(TokenId).then((result) => {
      owner = result;
    });
    console.log(owner);

    assert.equal(accounts[1], owner, "NFT Transfer Failed");
  });
});
