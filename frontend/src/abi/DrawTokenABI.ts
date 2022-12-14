import { AbiItem } from "web3-utils";

export const DrawToken: AbiItem[] = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_wooToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mintReadmeToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_saleReadmeToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "mintReadmeToken",
    outputs: [
      {
        internalType: "contract MintReadmeToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "saleReadmeToken",
    outputs: [
      {
        internalType: "contract SaleReadmeToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "winnerCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "wooToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "shareToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinnerCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
