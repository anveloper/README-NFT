//const Migrations = artifacts.require("Migrations");
const SsafyToken = artifacts.require("SsafyToken");
const ReadmeToken = artifacts.require("ReadmeToken");
const SaleFactory = artifacts.require("SaleFactory");

module.exports = async function (deployer) {
  let NFTAddr = await deployer.deploy(ReadmeToken);
  let TokenAddr = await deployer.deploy(SsafyToken, "SSAFY", "SSF", 0);
  let NFTAuctionAddr = await deployer.deploy(SaleFactory, SsafyToken.address, ReadmeToken.address);
};