//const Migrations = artifacts.require("Migrations");
const MintReadme = artifacts.require("MintReadmeToken");
const SaleReadme = artifacts.require("SaleReadmeToken");
const GetReadme = artifacts.require("GetReadmeToken");
const BidReadme = artifacts.require("BidReadmeToken");
const Ssafy = artifacts.require("SsafyToken");

module.exports = async function (deployer) {
  await deployer.deploy(MintReadme);
  await deployer.deploy(SaleReadme, MintReadme.address);
  await deployer.deploy(BidReadme, MintReadme.address, SaleReadme.address);
  await deployer.deploy(
    GetReadme,
    MintReadme.address,
    SaleReadme.address,
    BidReadme.address
  );

  await deployer.deploy(Ssafy, "Readme", "RMT");
};
