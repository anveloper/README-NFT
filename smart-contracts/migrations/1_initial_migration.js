//const Migrations = artifacts.require("Migrations");
// 상호작용할 계약을 truffle에게 알리는 역할
const SsafyToken = artifacts.require("SsafyToken");
const ReadmeToken = artifacts.require("ReadmeToken");
const SaleFactory = artifacts.require("SaleFactory");

// module.exports : 함수 내보내기, deployer를 첫번째 매개변수로 가짐
module.exports = async function (deployer) {
  let NFTAddr = await deployer.deploy(ReadmeToken);
  let TokenAddr = await deployer.deploy(SsafyToken, "SSAFY", "SSF", 0);
  let NFTAuctionAddr = await deployer.deploy(SaleFactory, SsafyToken.address, ReadmeToken.address);
};