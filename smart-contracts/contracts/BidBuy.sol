// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./ReadmeToken.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/IERC721.sol";

// 경매 구매
contract BidBuy {
    address public seller;
    address public buyer;
    uint256 public saleStartTime; 
    uint256 public saleEndTime;
    uint256 public startPrice; // 최저
    uint256 public purchasePrice; // 구매 가격
    uint256 public tokenId;
    address public currencyAddress;
    address public nftAddress; 
    bool public ended; 
 
    // 최고 입찰 상태
    address public highestBidder; 
    uint256 public highestBid;

    IERC20 public erc20Contract; 
    IERC721 public erc721Contract;

    // 현재 입찰 현황
    event BidMade(
        address BidBuyContractAddress,
        uint256 tokenId,
        address bidder,
        uint256 amount,
        address currencyAddress
    );

    // 입찰 기간 종료 후, 입찰자가 있는 경우의 구매 현황
    event BuyEnded(
        address BidBuyContractAddress,
        uint256 tokenId,
        address winner,
        uint256 amount
    );

    constructor(
        address _seller,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _startPrice,
        uint256 _tokenId,
        address _currencyAddress,
        address _nftAddress
    ) {
        require(_startPrice > 0);
        seller = _seller;
        saleStartTime = _startTime;
        saleEndTime = _endTime;
        startPrice = _startPrice;
        tokenId = _tokenId;
        currencyAddress = _currencyAddress;
        nftAddress = _nftAddress;
        ended = false;
        erc20Contract = IERC20(_currencyAddress); 
        erc721Contract = IERC721(_nftAddress);
    }
    
    // 입찰
    function bid(uint256 bid_amount) public onlySeller onlyAfterStart onlyBeforeEnd returns (bool){
        address bidder = msg.sender;
        bool result = false;

        // 입찰 금액 확인
        require(bid_amount > 0, "Zero Price");
        // 지갑이 bidder에게 돈 사용 권한을 주었는지 확인
        require(erc20Contract.approve(bidder, bid_amount), "Not approved for ERC20");
        // 지갑 잔액 확인
        require(erc20Contract.balanceOf(bidder) >= bid_amount, "Not enough Token");
        // 최저 입찰 금액 초과 확인
        require(bid_amount > startPrice, "Please Over startPrice");
        // 현재 최고 입찰 금액 초과 확인
        require(bid_amount > highestBid, "Your bid is lower than HighestBid");


        // 새로운 입찰자 등장
        if (highestBidder != address(0)) {
            // 새로운 입찰자에게 지갑 사용 권한 승인
            erc20Contract.approve(bidder, highestBid);

            if(erc20Contract.balanceOf(address(this)) != 0){
                // 기존 최고 입찰자에게 컨트랙트가 환불
                erc20Contract.transferFrom(address(this), highestBidder, highestBid);
            }
        }
        // 승인받은 입찰자가 컨트랙트에게 토큰 전송
        erc20Contract.transferFrom(bidder, address(this), bid_amount);

        // 최고 입찰자와 입찰 금액 변경
        highestBid = bid_amount;
        highestBidder = bidder;

        emit BidMade(address(this), tokenId, bidder, highestBid, currencyAddress);

        // 입찰자 확인
        if(highestBidder == bidder){
            result = true;
        }

        return result;
    }

    // 입찰 기간 종료 후, 입찰자가 있는 경우의 구매
    function purchase(uint finalPrice) public onlySeller isSaleOver returns (bool){
        address purchaser = msg.sender;
        bool result = false;
        
        purchasePrice = finalPrice;

        // 지갑이 최종 입찰자에게 돈 사용 권한을 주었는지 확인
        require(erc20Contract.approve(purchaser, purchasePrice), "Not approved for ERC20");

        // 송금 : Sale -> 구매자
        erc20Contract.transferFrom(address(this), seller, purchasePrice);

        // 소유권 이전 : BidBuy -> 구매자(purchaser)
        erc721Contract.transferFrom(address(this), purchaser, tokenId);

        emit BuyEnded(address(this), tokenId, purchaser, purchasePrice);

        _end();

        // 소유권 확인
        if(erc721Contract.ownerOf(tokenId) == purchaser){
            result = true;
        }

        return result;
    }
    
    // 입찰 기간 종료 후, 입찰자가 없는 경우
    function close() public onlySeller isSaleOver returns (bool){
        address requestor = msg.sender;
        bool result = false;
        
        // 아무나 종료할 수 없음
        require(requestor == seller, "You do not have permission");

        // 소유권 재이전 : BidBuy -> 판매자
        erc721Contract.transferFrom(address(this), seller, tokenId);

        _end();

        // 소유권 확인
        if(erc721Contract.ownerOf(tokenId) == requestor){
            result = true;
        }

        return result;
    }

    // 남은 시간 계산
    function getTimeLeft() public view returns (int256) {
        return (int256)(saleEndTime - block.timestamp);
    }

    // 판매 정보
    function getSaleInfo()
        public
        view
        returns (
            address,
            address,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            address,
            address,
            bool
        )
    {
        return (
            seller,
            buyer,
            saleStartTime,
            saleEndTime,
            startPrice,
            tokenId,
            purchasePrice,
            highestBid,
            highestBidder,
            currencyAddress,
            nftAddress,
            ended
        );
    }

    // 최고 입찰가
    function getHighestBid() public view returns(uint256){
        return highestBid;
    }

    // internal 혹은 private 함수 선언시 아래와 같이 _로 시작하도록 네이밍합니다.
    function _end() internal {
        ended = true;
    }


    // 잔액 반환
    function _getCurrencyAmount() private view returns (uint256) {
        return erc20Contract.balanceOf(msg.sender);
    }

 
    modifier onlySeller() {
        require(msg.sender != seller, "Sale: You are not seller.");
        _;
    }

    modifier onlyAfterStart() {
        require(block.timestamp >= saleStartTime, "Time yet");
        _;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp <= saleEndTime, "Time over");
        _;
    }

    modifier isSaleOver() {
        require(block.timestamp > saleEndTime, "Time over");
        _;
    }
}
