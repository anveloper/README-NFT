import { AbiItem } from "web3-utils";

export const GetReadmeToken: AbiItem[] = [
  {
    inputs: [
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
    name: "getTotalToken",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "readmeTokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "readmeTokenPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "readmeTokenOwner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metaDataURI",
            type: "string",
          },
        ],
        internalType: "struct GetReadmeToken.ReadmeTokenData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "getSaleReadmeToken",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "readmeTokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "readmeTokenPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "readmeTokenOwner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metaDataURI",
            type: "string",
          },
        ],
        internalType: "struct GetReadmeToken.ReadmeTokenData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_readmeTokenOwner",
        type: "address",
      },
    ],
    name: "getMyReadmeToken",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "readmeTokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "readmeTokenPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "readmeTokenOwner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metaDataURI",
            type: "string",
          },
        ],
        internalType: "struct GetReadmeToken.ReadmeTokenData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_readmeTokenOwner",
        type: "address",
      },
    ],
    name: "getDrawReadmeToken",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "readmeTokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "readmeTokenPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "readmeTokenOwner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metaDataURI",
            type: "string",
          },
        ],
        internalType: "struct GetReadmeToken.ReadmeTokenData[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
];
