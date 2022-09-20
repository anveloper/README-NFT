// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/IERC721.sol";

// 판매 등록
contract Sale is Ownable {
    address public admin;
    mapping(uint256 => address) public sales; // 토큰 별 판매 주소 기록

    IERC20 public erc20Contract; // ssafy wallet 껍데기
    IERC721 public erc721Contract; // ssafyToken 껍데기

    event NewSale(
        address indexed saleContractAddress,
        address indexed owner, 
        address currencyAddress,
        address nftAddress,
        uint256 price,
        uint256 saleStartTime,
        uint256 saleEndTime,
        uint256 tokenId
    );

    constructor(
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = msg.sender;

        erc20Contract = IERC20(_currencyAddress);
        erc721Contract = IERC721(_nftAddress);
    }


    // 경매 등록
    function bid (
        address seller,
        uint256 tokenId,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime,
        address currencyAddress,
        address nftAddress
    ) public validAddress(seller) ZeroPrice(startPrice)
    returns (address) {

        erc20Contract = IERC20(currencyAddress); 
        erc721Contract =  IERC721(nftAddress);

        require(seller == erc721Contract.ownerOf(tokenId), "Your not owner of this NFT");

        // 새로운 경매 판매 생성
        BidBuy BidBuyContract = new BidBuy(
            seller,
            tokenId,
            startPrice,
            startTime,
            endTime,
            currencyAddress,
            nftAddress
        );

        sales[tokenId] = address(BidBuyContract); // 판매 주소 기록
    
        // 토큰 소유권(판매자 -> Sale)
        erc721Contract.transferFrom(seller, address(this), tokenId);

        // 토큰 소유권(Sale -> BidBuyContract)
        erc721Contract.transferFrom(address(this), address(BidBuyContract), tokenId);

        return address(BidBuyContract);
    }

    // 즉시 구매 등록
    function nowbuy (
        address seller,
        uint256 tokenId,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime,
        address currencyAddress,
        address nftAddress
    ) public validAddress(seller) ZeroPrice(startPrice)
    returns (address) {

        erc20Contract = IERC20(currencyAddress); 
        erc721Contract =  IERC721(nftAddress);

        require(seller == erc721Contract.ownerOf(tokenId), "Your not owner of this NFT");

        // 새로운 즉시 구매 판매 생성
        NowBuy NowBuyContract = new NowBuy(
            seller,
            tokenId,
            startPrice,
            startTime,
            endTime,
            currencyAddress,
            nftAddress
        );

        sales[tokenId] = address(NowBuyContract); // 판매 주소 기록
    
        // 토큰 소유권(판매자 -> Sale)
        erc721Contract.transferFrom(seller, address(this), tokenId);

        // 토큰 소유권(Sale -> NowBuyContract)
        erc721Contract.transferFrom(address(this), address(NowBuyContract), tokenId);

        return address(NowBuyContract);
    }

    function getSaleAddress(uint256 tokenId) public view returns (address) {
        return sales[tokenId];
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid Address");
        _;
    }

    modifier ZeroPrice(uint256 Price) {
        require(Price > 0, "Price is zero");
        _;
    }



            

}
