// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract GetReadmeToken{
    MintReadmeToken public mintReadmeToken;
    SaleReadmeToken public saleReadmeToken;

    constructor (address _mintReadmeToken, address _saleReadmeToken) {
        mintReadmeToken = MintReadmeToken(_mintReadmeToken);
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
    function getTotalToken() public view returns (ReadmeTokenData[] memory) {
        // 전체 토큰 목록 가져오기
        uint256[] memory totalToken = mintReadmeToken.getTotalReadmeToken();
        // 토큰 개수 확인
        uint256 totalTokenCount = totalToken.length;

        require(totalTokenCount > 0, "Not exists token");

        ReadmeTokenData[] memory totalReadmeTokendata = new ReadmeTokenData[](totalTokenCount);

        for(uint256 i = 0; i < totalTokenCount;) {
            uint256 readmeTokenId = totalToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); // price
            address readmeTokenOwner = mintReadmeToken.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeToken.tokenURI(readmeTokenId); // 메타데이터

            totalReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);

            unchecked{
                ++i;
            }

        }
        
        return totalReadmeTokendata;
    }

    // get: 전체 판매 중인 토큰 정보 조회
    function getSaleReadmeToken() public view returns (ReadmeTokenData[] memory) {
        // 판매 중인 토큰 목록 가져오기
        uint256[] memory onSaleReadmeToken = saleReadmeToken.getOnSaleReadmeToken();
        // 판매중인 토큰 개수 확인
        uint256 readmeTokenCount = onSaleReadmeToken.length;
        // 비어있는 목록인지 확인
        require(readmeTokenCount > 0, "Not exist on sale token");

        ReadmeTokenData[] memory onSaleReadmeTokendata = new ReadmeTokenData[](readmeTokenCount);

        for(uint256 i = 0; i < readmeTokenCount;){
            uint256 readmeTokenId = onSaleReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); // price
            address readmeTokenOwner = mintReadmeToken.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeToken.tokenURI(readmeTokenId); // 메타데이터

            onSaleReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);

            unchecked{
                ++i;
            }
        }

        return onSaleReadmeTokendata;
    }

    // get: 내 소유 전체 토큰 정보 조회
    function getMyReadmeToken(address _readmeTokenOwner) public view returns (ReadmeTokenData[] memory) {
        // 내 소유 토큰 가져오기
        uint256[] memory myReadmeToken = mintReadmeToken.getOwnedTokens(_readmeTokenOwner);
        // 소유 중인 토큰 개수 확인
        uint256 myReadmeTokenCount = myReadmeToken.length;

        // 비어있는 목록인지 확인
        require(myReadmeTokenCount > 0, "Not exist my token");

        ReadmeTokenData[] memory myReadmeTokendata = new ReadmeTokenData[](myReadmeTokenCount);

        for(uint256 i = 0; i < myReadmeTokenCount;){
            uint256 readmeTokenId = myReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeToken.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeToken.tokenURI(readmeTokenId); // 메타데이터

            myReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);

            unchecked{
                ++i;
            }
        }

        return myReadmeTokendata;
    }

    // get: 내가 그린 토큰 정보 조회
    function getDrawReadmeToken(address _readmeTokenOwner) public view returns (ReadmeTokenData[] memory) {
        // 내가 그린 토큰 가져오기
        uint256[] memory drawReadmeToken = mintReadmeToken.getDrawTokens(_readmeTokenOwner);
        // 그린 토큰 개수 확인
        uint256 drawReadmeTokenCount = drawReadmeToken.length;

        // 비어있는 목록인지 확인
        require(drawReadmeTokenCount > 0, "Not exist draw token");

        ReadmeTokenData[] memory drawReadmeTokendata = new ReadmeTokenData[](drawReadmeTokenCount);

        for(uint256 i = 0; i < drawReadmeTokenCount;){
            uint256 readmeTokenId = drawReadmeToken[i]; // tokenId
            uint256 readmeTokenPrice = saleReadmeToken.getReadmeTokenPrice(readmeTokenId); //price
            address readmeTokenOwner = mintReadmeToken.ownerOf(readmeTokenId); // 소유주
            string memory metaDataURI = mintReadmeToken.tokenURI(readmeTokenId); // 메타데이터

            drawReadmeTokendata[i] = ReadmeTokenData(readmeTokenId, readmeTokenPrice, readmeTokenOwner, metaDataURI);

            unchecked{
                ++i;
            }
        }

        return drawReadmeTokendata;
    }

}
