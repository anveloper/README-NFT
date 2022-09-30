// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract BidReadmeToken{
    MintReadmeToken public mintReadmeToken;
    SaleReadmeToken public saleReadmeToken;

    constructor (address _mintReadmeToken, address _saleReadmeToken) {
        mintReadmeToken = MintReadmeToken(_mintReadmeToken);
        saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
    }

    // 입찰 기록 저장
    struct Bid {
        address bidder;
        uint256 bidPrice;
    }

    // 토큰 정보
    struct Token {
        uint256 readmeTokenId;
        uint256 readmeTokenPrice;
        address readmeTokenOwner;
        string metaDataURI;
    }

    // 경매에 판매 등록된 토큰 저장 리스트(조회용)
    uint256[] public onAuctionReadmeToken;
    // 토큰 별(tokenId) 가격 저장
    mapping (uint256 => uint256) public readmeTokenPrice;
    // 토큰 별 시간 저장
    mapping (uint256 => uint256) public readmeTokenEndTime;
    // 토큰별 입찰자별 입찰 가격 저장
    mapping (uint256 => mapping(address => uint256)) public tokenBiddingList;
    mapping (uint256 => Bid[]) public Bids;
    // 토큰별 현재 최고 입찰가 저장
    mapping (uint256 => uint256) public nowHighestPrice;
    // 입찰자 별 입찰 토큰 정보 조회
    mapping (address => Token[]) public Tokens;

    // 최고가 저장
    uint256 highestPrice;
    // 최고가 입찰자 주소 저장
    address highestBidder;


    // 경매 등록: seller
    function enrollAuction(
        uint256 _readmeTokenId, 
        uint256 _price,
        uint256 _endTime
    ) public {
        
        address tokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        address seller = msg.sender;

        // 주인 확인
        require(seller == tokenOwner, "Not Owner");
        // 등록 가격 확인
        require(_price > 0, "Zero Price");
        // 판매/경매 등록 여부 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId) != true, "Already on Market");
        // 경매 등록이 되었는지 확인
        require(readmeTokenPrice[_readmeTokenId] == 0, "Not On Auction");

        
        // 가격 등록
        readmeTokenPrice[_readmeTokenId] = _price;
        // 시간 등록
        uint256 endTime = _endTime + block.timestamp;
        readmeTokenEndTime[_readmeTokenId] = endTime;

        // 경매 등록 목록 수정
        onAuctionReadmeToken.push(_readmeTokenId);
        // 판매/경매 등록으로 변경
        saleReadmeToken.setIsActive(_readmeTokenId, true);
    }

    // 입찰: bidder
    function bid(
        IERC20 token,
        uint256 _readmeTokenId,
        uint256 _biddingPrice
    ) public {

        uint256 price = readmeTokenPrice[_readmeTokenId];
        address bidder = msg.sender;
        
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId]);
        // 판매/경매 등록 여부 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId), "Not on Market");
        // 경매 중 확인
        require(price > 0, "Not On Auction");
        // 입찰 능력 확인
        require(highestPrice <= token.balanceOf(msg.sender), "No Money");
        // 입찰가가 현재 최고가 보다 큰 지 확인
        require(_biddingPrice > highestPrice, "Lower Than HighestPrice");
        // 입찰자가 판매자인지 확인
        require(bidder != mintReadmeToken.ownerOf(_readmeTokenId), "You are Seller");
        
        // 입찰자와 입찰 금액 저장
        tokenBiddingList[_readmeTokenId][bidder] = _biddingPrice;
        // 현재 최고 입찰가 저장
        nowHighestPrice[_readmeTokenId] = _biddingPrice;

        // 입찰 기록 저장
        Bids[_readmeTokenId].push(Bid({
            bidder: bidder,
            bidPrice: _biddingPrice
        }));

        // 입찰자 별 입찰 토큰 정보 조회
        Tokens[bidder].push(Token({
            readmeTokenId: _readmeTokenId,
            readmeTokenPrice: _biddingPrice,
            readmeTokenOwner: mintReadmeToken.ownerOf(_readmeTokenId),
            metaDataURI: mintReadmeToken.tokenURI(_readmeTokenId)
        }));

        // 최고가 변경
        highestPrice = _biddingPrice;
        // 최고 입찰가 변경
        highestBidder = bidder;

    }

    // 낙찰: buyer
    function buy(
        IERC20 token,
        uint256 _readmeTokenId
    ) public {
        address readmeTokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        address buyer = msg.sender;
        uint256 price = readmeTokenPrice[_readmeTokenId];

        // 종료 시간 확인
        require(block.timestamp > readmeTokenEndTime[_readmeTokenId], "Not Yet");
        // 구매자 확인
        require(highestBidder == buyer, "Not buyer");
        // 판매/경매 등록 여부 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId), "Not on Market");
        // 경매 증 확인
        require(price > 0, "Not On Auction");
        // 구매자의 구매 능력 확인
        require(highestPrice <= token.balanceOf(msg.sender), "No Money");
        // 낙찰자가 판매자이지 확인
        require( buyer != readmeTokenOwner, "You are Seller");

        // 송금
        token.transferFrom(msg.sender, readmeTokenOwner, price);

        // 토큰(돈) 전송
        //payable(readmeTokenOwner).transfer(msg.value);
        
        // nft 전송
        mintReadmeToken.safeTransferFrom(readmeTokenOwner, buyer, _readmeTokenId);

        // 낙찰된 nft가 판매되었으니 판매 가격을 0으로 수정
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        saleReadmeToken.setIsActive(_readmeTokenId, false);

        // 경매 중 목록 수정: 판매된 nft를 목록에서 제거
        for(uint256 i = 0; i < onAuctionReadmeToken.length;) {
            if(readmeTokenPrice[onAuctionReadmeToken[i]] == 0){
                onAuctionReadmeToken[i] = onAuctionReadmeToken[onAuctionReadmeToken.length - 1];
                onAuctionReadmeToken.pop();
                break;
            }
            unchecked{
                ++i;
            }
        }

        // 소유한 토큰 목록 수정
        mintReadmeToken.removeTokenFromList(buyer, readmeTokenOwner, _readmeTokenId);
    }

    // 경매 취소
    function cancelAuction(
        uint256 _readmeTokenId
    ) public {
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address cancel = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);

        // 호출자가 판매자인지 확인
        require(cancel == seller, "You are Not Seller");
        // 판매/경매 등록 여부 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId), "Not on Market");
        // 경매 중 확인
        require(price > 0, "Not On Auction");
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time Over");
        
        // 판매 가격을 0으로 수정하여 경매 목록에서 제외
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        saleReadmeToken.setIsActive(_readmeTokenId, false);

        // 경매 중 목록 수정
        for(uint256 i = 0; i < onAuctionReadmeToken.length;) {
            if(readmeTokenPrice[onAuctionReadmeToken[i]] == 0){
                onAuctionReadmeToken[i] = onAuctionReadmeToken[onAuctionReadmeToken.length - 1];
                onAuctionReadmeToken.pop();
                break;
            }
            unchecked{
                ++i;
            }
        }
    }

    // 미입찰
    function refuncAuction(
        uint256 _readmeTokenId
    ) public {
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address cancel = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);

        // 입찰 여부 확인
        require(nowHighestPrice[_readmeTokenId] == 0, "Here is Bidder");
        // 호출자가 판매자인지 확인
        require(cancel == seller, "You are Not Seller");
        // 판매/경매 등록 여부 확인
        require(saleReadmeToken.getIsActive(_readmeTokenId), "Not on Market");
        // 경매 중 확인
        require(price > 0, "Not On Auction");
        // 시간 확인
        require(block.timestamp > readmeTokenEndTime[_readmeTokenId], "Time Over");
        
        // 판매 가격을 0으로 수정하여 경매 목록에서 제외
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        saleReadmeToken.setIsActive(_readmeTokenId, false);

        // 경매 중 목록 수정
        for(uint256 i = 0; i < onAuctionReadmeToken.length;) {
            if(readmeTokenPrice[onAuctionReadmeToken[i]] == 0){
                onAuctionReadmeToken[i] = onAuctionReadmeToken[onAuctionReadmeToken.length - 1];
                onAuctionReadmeToken.pop();
                break;
            }
            unchecked{
                ++i;
            }
        }
    }
        
    // get: 경매 중인 토큰 개수 조회
    function getTokenOnAuctionArrayLength() public view returns (uint256){
        return onAuctionReadmeToken.length;
    }

    // get: 경매 중인 토큰 전체 목록 조회
    function getTokenOnAuction() public view returns (uint256[] memory){
        return onAuctionReadmeToken;
    }

    // get: 개별 토큰 가격 조회
    function getReadmeTokenPrice(uint256 _readmeTokenId) public view returns (uint256) {
        return readmeTokenPrice[_readmeTokenId];
    }

    // get: 현재 최고 입찰가 조회
    function getReadmeTokenHigh(uint256 _readmeTokenId) public view returns (uint256) {
        return nowHighestPrice[_readmeTokenId];
    }

    // get: 토큰 별 입찰 기록 조회
    function getBidList(uint256 _readmeTokenId) public view returns (Bid[] memory){
        return Bids[_readmeTokenId];
    }
    // get: 내가 경매 참여중인 NFT 정보 조회
    function getMyAuction(address _bidder) public view returns (Token[] memory) {
        return Tokens[_bidder];
    }
    
}