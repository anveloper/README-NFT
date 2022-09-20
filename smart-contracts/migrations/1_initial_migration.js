//const Migrations = artifacts.require("Migrations");
const Ssafy = artifacts.require("SsafyToken");
const Readme = artifacts.require("ReadmeToken");
const SaleFac = artifacts.require("Sale");

// module.exports : 내보내기, deployer를 첫번째 매개변수로 가짐
module.exports = async function (deployer) {
  let SsafyToken = await deployer.deploy(Ssafy, "SSAFY", "SSF", 0);
  let ReadmeToken = await deployer.deploy(Readme);
  let Sale = await deployer.deploy(SaleFac, Ssafy.address, Readme.address);
};