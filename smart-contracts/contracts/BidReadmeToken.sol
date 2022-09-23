// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract BidReadmeToken{
    MintReadmeToken public mintReadmeTokenAddress;
    SaleReadmeToken public saleReadmeToken;

    constructor (address _mintReadmeTokenAddress, address _saleReadmeToken) {
        mintReadmeTokenAddress = MintReadmeToken(_mintReadmeTokenAddress);
        saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
    }

    // 판매 등록
}
