// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";
import "./BidReadmeToken.sol";

contract GetReadmeToken{
    MintReadmeToken public mintReadmeTokenAddress;
    SaleReadmeToken public saleReadmeToken;
    BidReadmeToken public bidReadmeToken;

    constructor (address _mintReadmeTokenAddress, address _saleReadmeToken, address _bidReadmeToken) {
        mintReadmeTokenAddress = MintReadmeToken(_mintReadmeTokenAddress);
        saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
        bidReadmeToken = BidReadmeToken(_bidReadmeToken);
    }

    // 토큰 정보 : id, 가격, 소유주, 메타데이터
    struct ReadmeTokenData {
        uint256 readmeTokenId;
        uint256 readmeTokenPrice;
        address readmeTokenOwner;
        string metaDataURI;
    }

    // get: 전체 판매 중인 토큰 정보 조회
    function getSaleReadmeToken() view public returns (ReadmeTokenData[] memory) {
        // 판매 중인 토큰 목록 가져오기
        uint256[] memory onSaleReadmeToken = saleReadmeToken.getOnSaleReadmeToken();
        // 판매중인 토큰 개수 확인
        uint256 readmeTokenCount = saleReadmeToken.getOnSaleReadmeTokenArrayLength();

        // 비어있는 목록인지 확인
        require(readmeTokenCount > 0, "Not exist on sale token");

        ReadmeTokenData[] memory onSaleReadmeTokendata = new ReadmeTokenData[](readmeTokenCount);

        for(uint256 i = 0; i < readmeTokenCount; i++){
            uint256 readmeTokenId = onSaleReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); // price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            onSaleReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return onSaleReadmeTokendata;
    }

    // get: 내 소유 전체 토큰 정보 조회
    function getMyReadmeToken(address _readmeTokenOwner) view public returns (ReadmeTokenData[] memory) {
        // 내 소유 토큰 가져오기
        uint256[] memory myReadmeToken = mintReadmeTokenAddress.getOwnedTokens(_readmeTokenOwner);
        // 소유 중인 토큰 개수 확인
        uint256 myReadmeTokenCount = myReadmeToken.length;

        // 비어있는 목록인지 확인
        require(myReadmeTokenCount > 0, "Not exist my token");

        ReadmeTokenData[] memory myReadmeTokendata = new ReadmeTokenData[](myReadmeTokenCount);

        for(uint256 i = 0; i < myReadmeTokenCount; i++){
            uint256 readmeTokenId = myReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            myReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return myReadmeTokendata;
    }

    // get: 내가 그린 토큰 정보 조회
    function getDrawReadmeToken(address _readmeTokenOwner) view public returns (ReadmeTokenData[] memory) {
        // 내가 그린 토큰 가져오기
        uint256[] memory drawReadmeToken = mintReadmeTokenAddress.getDrawTokens(_readmeTokenOwner);
        // 그린 토큰 개수 확인
        uint256 drawReadmeTokenCount = drawReadmeToken.length;

        // 비어있는 목록인지 확인
        require(drawReadmeTokenCount > 0, "Not exist draw token");

        ReadmeTokenData[] memory drawReadmeTokendata = new ReadmeTokenData[](drawReadmeTokenCount);

        for(uint256 i = 0; i < drawReadmeTokenCount; i++){
            uint256 readmeTokenId = drawReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            drawReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return drawReadmeTokendata;
    }

    // get: 전체 경매중인 토큰 조회
    function getAuctionToken() view public returns (ReadmeTokenData[] memory) {
        // 경매중인 토큰 목록
        uint256[] memory onAuctionReadmeToken = bidReadmeToken.getTokenOnAuction();

        // 경매중인 토큰 개수 확인
        uint256 readmeTokenCount = onAuctionReadmeToken.length;

        // 비어있는 목록인지 확인
        require(readmeTokenCount > 0, "Not exist on sale token");

        ReadmeTokenData[] memory onAuctionReadmeTokendata = new ReadmeTokenData[](readmeTokenCount);

        for(uint256 i = 0; i < readmeTokenCount; i++){
            uint256 readmeTokenId = onAuctionReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); // price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            onAuctionReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return onAuctionReadmeTokendata;
    }
}
