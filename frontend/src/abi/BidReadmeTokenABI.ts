import { AbiItem } from "web3-utils";

export const BidReadmeToken: AbiItem[] = [
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Bids",
    outputs: [
      {
        internalType: "address",
        name: "bidder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bidPrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bidTime",
        type: "uint256",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Tokens",
    outputs: [
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
        internalType: "uint256",
        name: "bidTime",
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
    stateMutability: "view",
    type: "function",
    constant: true,
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nowHighestPrice",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "onAuctionReadmeToken",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "readmeTokenEndTime",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "readmeTokenPrice",
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
    name: "getTokenOnAuction",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "getReadmeTokenPrice",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "getReadmeTokenHigh",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "getBidList",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "bidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bidPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bidTime",
            type: "uint256",
          },
        ],
        internalType: "struct BidReadmeToken.Bid[]",
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
        name: "_bidder",
        type: "address",
      },
    ],
    name: "getMyAuction",
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
            internalType: "uint256",
            name: "bidTime",
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
        internalType: "struct BidReadmeToken.Token[]",
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
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
    ],
    name: "enrollAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_biddingPrice",
        type: "uint256",
      },
    ],
    name: "bid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_readmeTokenId",
        type: "uint256",
      },
    ],
    name: "refuncAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
