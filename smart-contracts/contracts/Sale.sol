// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./ReadmeToken.sol";
import "./token/ERC20/ERC20.sol";
import "./token/ERC721/ERC721.sol";

// 판매 등록
contract Sale is Ownable {
    address public admin;
    mapping(uint256 => address) public sales; // 토큰 별 판매 주소

    ERC20 public erc20Contract; // ssafy wallet 껍데기
    ERC721 public erc721Contract; // nft 발행 및 erc721 사용을 위한 껍데기

    // 판매자의 판매 등록
    event NewSale(
        address indexed saleContractAddress,
        address indexed owner, 
        address currencyAddress,
        address nftAddress,
        uint256 startPrice,
        uint256 tokenId,
        uint256 saleStartTime,
        uint256 saleEndTime,
        bool saleType
    );

    constructor(
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = msg.sender;

        erc20Contract = ERC20(_currencyAddress);
        erc721Contract = ERC721(_nftAddress);
    }

    // SaleContract 주소 반환
    function getSaleAddress(uint256 tokenId) public view returns (address) {
        return sales[tokenId];
    }

    function createSale (
        address seller,
        uint256 itemId,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime,
        bool saleType, // 경매 or 즉시 구매
        address currencyAddress,
        address nftAddress
    ) public returns (address) {

        erc20Contract = ERC20(currencyAddress); 
        erc721Contract =  ERC721(nftAddress);
        
        // seller 검사
        require(seller != address(0), "Invalid Address");
        require(seller == erc721Contract.ownerOf(itemId), "Your not owner of this NFT");

        require(startPrice > 0, "Price is zero");

        Buy BuyContract = new Buy(
            admin,
            seller,
            itemId,
            startPrice,
            startTime,
            endTime,
            saleType,
            currencyAddress,
            nftAddress
        );

        sales[itemId] = address(SaleContract); // 판매 주소 기록
    
        // 토큰 소유권(판매자 -> Sale)
        erc721Contract.transferFrom(seller, address(SaleContract), itemId);

        return address(SaleContract);
    }

    function allSales(uint256 itemId) public view returns (address) {
        return sales[itemId];
    }
}
