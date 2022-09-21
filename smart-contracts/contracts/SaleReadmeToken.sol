// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";

contract SaleReadmeToken{
    MintReadmeToken public mintReadmeTokenAddress;

    constructor (address _mintAnimalTokenAddress) {
        mintReadmeTokenAddress = MintReadmeToken(_mintAnimalTokenAddress);
    }

    // 토큰 Id -> 가격
    mapping (uint256 => uint256) public readmeTokenPrices;
    // 판매 등록 된 토큰 
    uint256[] public onSaleReadmeToken;
    // 토큰 Id -> 시간
    mapping (uint256 => uint256) public readmeTokenEndTime;

    // 판매 등록
    function setForSaleReadmeToken(
        uint256 _readmeTokenId, 
        uint256 _price,
        uint256 _endTime
        ) public{
        
        // 판매등록하려는 주인 확인
        address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(_readmeTokenId);
        address seller = msg.sender;

        // 판매등록 = 주인
        require(seller == readmeTokenOwner, "Not Owner");
        // 가격은 0원 이상 설정
        require(_price > 0, "Zero Price");
        // 판매 등록 확인
        require(readmeTokenPrices[_readmeTokenId] == 0, "Already On Sale");
        // 컨트랙트의 권한 확인
        require(mintReadmeTokenAddress.isApprovedForAll(readmeTokenOwner, address(this)), "Not Approve");
        // 가격 등록
        readmeTokenPrices[_readmeTokenId] = _price;
        // 시간 등록
        readmeTokenEndTime[_readmeTokenId] = _endTime;
        // 판매 등록 목록 수정
        onSaleReadmeToken.push(_readmeTokenId);
    }

    // 판매
    function purchaseReadmeToken(uint256 _readmeTokenId) public payable {
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrices[_readmeTokenId];
        address buyer = msg.sender;

        // 판매자 확인
        address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(_readmeTokenId);
        // 판매중 확인
        require(price > 0, "Not On Sale");
        // 구매자의 구매 능력 확인
        require(price <= msg.value, "No money");
        // 판매자 != 구매자 
        require(readmeTokenOwner != buyer);
        
        // 돈: 구매자 -> 판매자
        payable(readmeTokenOwner).transfer(msg.value);
        
    }
}
