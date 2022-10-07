import Web3 from "web3";
import { MintReadmeToken } from "./abi/MintReadmeTokenABI";
import { SaleReadmeToken } from "./abi/SaleReadmeTokenABI";
import { GetReadmeToken } from "./abi/GetReadmeTokenABI";
import { BidReadmeToken } from "./abi/BidReadmeTokenABI";
import { DrawToken } from "./abi/DrawTokenABI";
import { SSF } from "./abi/SSFABI";

export const web3 = new Web3(window.ethereum);

const ABI = {
  MintReadmeToken: MintReadmeToken,
  SaleReadmeToken: SaleReadmeToken,
  GetReadmeToken: GetReadmeToken,
  BidReadmeToken: BidReadmeToken,
  DrawToken: DrawToken,
  SSF: SSF,
};
// mint ssafy
export const MintReadmeContract = new web3.eth.Contract(
  ABI.MintReadmeToken,
  process.env.REACT_APP_MINTREADMETOKEN_CA
);
//mint Go
export const MintReadMeContractGO = new web3.eth.Contract(
  ABI.MintReadmeToken,
  process.env.REACT_APP_MINTREADMETOKEN_CA_GO
);

//mint ssafy
export const mintReadmeToken = async (
  tokenURI: string,
  account: string,
  answer: string,
  solver: string
) =>
  await MintReadmeContract.methods
    .create(tokenURI, process.env.REACT_APP_SALEREADMETOKEN_CA, answer, solver)
    .send({ from: account });
//mint Go
export const mintReadmeTokenGo = async (
  tokenURI: string,
  account: string,
  answer: string,
  solver: string
) =>
  await MintReadMeContractGO.methods
    .create(
      tokenURI,
      process.env.REACT_APP_SALEREADMETOKEN_CA_GO,
      answer,
      solver
    )
    .send({ from: account });

// sale ssafy
export const SaleReadmeContract = new web3.eth.Contract(
  ABI.SaleReadmeToken,
  process.env.REACT_APP_SALEREADMETOKEN_CA
);
// sale go
export const SaleReadmeContractGO = new web3.eth.Contract(
  ABI.SaleReadmeToken,
  process.env.REACT_APP_SALEREADMETOKEN_CA_GO
);

//get ssafy
export const GetReadmeContract = new web3.eth.Contract(
  ABI.GetReadmeToken,
  process.env.REACT_APP_GETREADMETOKEN_CA
);
//get go
export const GetReadmeContractGO = new web3.eth.Contract(
  ABI.GetReadmeToken,
  process.env.REACT_APP_GETREADMETOKEN_CA_GO
);

export const SSFContract = new web3.eth.Contract(
  ABI.SSF,
  process.env.REACT_APP_ERC20_CA
);

export const BidReadmeContract = new web3.eth.Contract(
  ABI.BidReadmeToken,
  process.env.REACT_APP_BIDREADMETOKEN
);

export const DrawTokenContract = new web3.eth.Contract(
  ABI.DrawToken,
  process.env.REACT_APP_DRAWTOKEN
);
