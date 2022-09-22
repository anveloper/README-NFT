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

    // 경매에 판매 등록된 토큰 저장 리스트(조회용)
    uint256[] onAuctionReadmeToken;

    // 토큰 별(tokenId) 가격 저장
    mapping (uint256 => uint256) public readmeTokenPrices;

    // 토큰 별 시간 저장
    mapping (uint256 => uint256) public readmeTokenEndTime;

    // 토큰별 입찰자별 입찰 가격 저장 리스트
    mapping (uint256 => mapping(address => uint256)) public tokenBiddingList;

    // 최고가 저장
    uint256 highestPrice;

    // 최고가 입찰자 주소 저장
    address highestBidder;

    ////////////////// 함수 구현부 /////////////////////
    // 경매 등록
    function enrollAuction(
        uint256 _readmeTokenId, 
        uint256 _price,
        uint256 _endTime
    ) public {
        // 주인 확인
        address tokenOwner = mintReadmeTokenAddress.ownerOf(_readmeTokenId);
        address seller = msg.sender;
        require(seller == tokenOwner, "Not Owner");
        
        // 등록 가격 확인
        require(_price > 0, "Zero Price");

        // 경매 등록이 되었는지 확인
        require(readmeTokenPrices[_readmeTokenId] > 0, "Not On Auction");

        // 권한 확인
        require(mintReadmeTokenAddress.isApprovedForAll(seller, address(this)), "Not Approve");

        // setForSaleReadmeToken에서 경매 등록이 되었는지 확인하는 코드 추가해주세요 => 네... 사장님
        require(saleReadmeToken.getIsActive(_readmeTokenId) != true, "Already on Market");

        // 가격 등록
        readmeTokenPrices[_readmeTokenId] = _price;

        // 시간 등록
        readmeTokenEndTime[_readmeTokenId] = _endTime;

        // 경매 등록 목록 수정
        onAuctionReadmeToken.push(_readmeTokenId);

        // 판매/경매 등록으로 변경
        saleReadmeToken.setIsActive(_readmeTokenId, true);
    }

    // 입찰
    function bid(
        uint256 _readmeTokenId,
        uint256 _biddingPrice
    ) public payable {
        // 경매 중 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId), "Not on Market");

        // 입찰 능력 확인
        require(msg.value > highestPrice, "Not Enough Money");

        // 입찰가가 현재 최고가 보다 큰 지 확인
        require(_biddingPrice > highestPrice, "Lower Than HighestPrice");

        // 입찰자가 판매자인지 확인
        require(msg.sender != mintReadmeTokenAddress.ownerOf(_readmeTokenId), "You are Seller");

        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId]);

        // 입찰자와 입찰 금액 저장 : 입찰 목록 출력시 필요
        tokenBiddingList[_readmeTokenId][msg.sender] = _biddingPrice;

        // 최고가 변경
        highestPrice = _biddingPrice;

        // 최고 입찰가 변경
        highestBidder = msg.sender;
    }

    // 낙찰
    function buy(
        uint256 _readmeTokenId
    ) public payable {
        address readmeTokenOwner = mintReadmeTokenAddress.ownerOf(_readmeTokenId);
        // 종료 시간 확인
        require(block.timestamp > readmeTokenEndTime[_readmeTokenId], "Not Yet");

        // 경매 증 확인
        require(readmeTokenPrices[_readmeTokenId] > 0, "Not On Auction");

        // 구매 능력 확인
        require(msg.value > highestPrice);

        // 낙찰자가 판매자이지 확인
        require(msg.sender != readmeTokenOwner, "You are Seller");

        // 토큰(돈) 전송
        payable(readmeTokenOwner).transfer(msg.value);

        // nft 전송
        mintReadmeTokenAddress.safeTransferFrom(readmeTokenOwner, msg.sender, _readmeTokenId);

        // 낙찰된 nft가 판매되었으니 판매 가격을 0으로 수정
        readmeTokenPrices[_readmeTokenId] = 0;
        saleReadmeToken.setIsActive(_readmeTokenId, false);

        // 경매 중 목록 수정: 판매된 nft를 목록에서 제거
        for(uint256 i = 0; i < onAuctionReadmeToken.length; i++) {
            if(readmeTokenPrices[onAuctionReadmeToken[i]] == 0){
                onAuctionReadmeToken[i] = onAuctionReadmeToken[onAuctionReadmeToken.length - 1];
                onAuctionReadmeToken.pop();
                break;
            }
        }

        // 소유한 토큰 목록 수정
        mintReadmeTokenAddress.removeTokenFromList(msg.sender, readmeTokenOwner, _readmeTokenId);
    }

    // 경매 취소
    function cancelAuction(
        uint256 _readmeTokenId
    ) public {
        // 호출자가 판매자인지 확인
        require(msg.sender == mintReadmeTokenAddress.ownerOf(_readmeTokenId), "You are Not Seller");
        // 경매 중 확인
        require(readmeTokenPrices[_readmeTokenId] > 0, "Not On Auction");
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time Over");
        // 판매 가격을 0으로 수정하여 경매 목록에서 제외
        readmeTokenPrices[_readmeTokenId] = 0;
        saleReadmeToken.setIsActive(_readmeTokenId, false);
        // 경매 중 목록 수정
        for(uint256 i = 0; i < onAuctionReadmeToken.length; i++) {
            if(readmeTokenPrices[onAuctionReadmeToken[i]] == 0){
                onAuctionReadmeToken[i] = onAuctionReadmeToken[onAuctionReadmeToken.length - 1];
                onAuctionReadmeToken.pop();
                break;
            }
        }
    }
        
    // 경매 중인 토큰 정보 조회
    function getTokenOnAuction() public view returns (uint256[] memory){
        // 위에 구조체를 선언해서 필요한 정보(tokenid, 가격, 소유주, 메타데이터)를 선언
        // uint256 readmeTokenCount = onAuctionReadmeToken.length;
        // OnAuctionTokenData[] memory onSalereadmeTokendata = new OnAuctionTokenData[](readmeTokenCount);
        return onAuctionReadmeToken;
    }

    // (여기다 하고 싶은데 안되면 GetReadmeToken으로 이동해서..)

}
