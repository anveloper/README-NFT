// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract GetReadmeToken{
    MintReadmeToken public mintReadmeTokenAddress;
    SaleReadmeToken public saleReadmeToken;

    constructor (address _mintAnimalTokenAddress, address _saleReadmeToken) {
        mintReadmeTokenAddress = MintReadmeToken(_mintAnimalTokenAddress);
        saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
    }

    // 토큰 정보 : id, 가격, 소유주, 메타데이터
    struct ReadmeTokenData {
        uint256 readmeTokenId;
        uint256 readmeTokenPrice;
        address readmeTokenOwner;
        string metaDataURI;
    }


    // get: 전체 토큰 정보 조회
    function getReadmeTokend(address _readmeTokenOwner) view public returns (ReadmeTokenData[] memory) {
        // 잔여 nft
        uint256 readmeLength = mintReadmeTokenAddress.balanceOf(_readmeTokenOwner);
        // 남은 토큰이 있는지 확인
        require(readmeLength != 0, "Not have Token");

        ReadmeTokenData[] memory readmeTokendata = new ReadmeTokenData[](readmeLength);

        for(uint256 i = 0; i < readmeLength; i++){
            uint256 readmeTokenId = mintReadmeTokenAddress.tokenOfOwnerByIndex(_readmeTokenOwner, i); // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            readmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return readmeTokendata;
    }

    // get: 전체 판매 중인 토큰 정보 조회
    function getSaleReadmeTokend() view public returns (ReadmeTokenData[] memory) {
        // 판매 중인 토큰 목록 가져오기
        uint256[] memory onSaleReadmeToken = saleReadmeToken.getOnSaleReadmeToken();
        // 판매중인 토큰 개수 확인
        uint256 readmeTokenCount = saleReadmeToken.getOnSaleReadmeTokenArrayLength();

        // 비어있는 목록인지 확인
        require(readmeTokenCount > 0, "Not exist on sale token");

        ReadmeTokenData[] memory onSalereadmeTokendata = new ReadmeTokenData[](readmeTokenCount);

        for(uint256 i = 0; i < readmeTokenCount; i++){
            uint256 readmeTokenId = onSaleReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeTokenAddress.tokenURI(readmeTokenId); // 메타데이터

            onSalereadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);
        }

        return onSalereadmeTokendata;
    }

    // get: 내 소유 토큰 정보 조회
    function getMyReadmeTokend(address _readmeTokenOwner) view public returns (ReadmeTokenData[] memory) {
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
    function getDrawReadmeTokend(address _readmeTokenOwner) view public returns (ReadmeTokenData[] memory) {
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
}
