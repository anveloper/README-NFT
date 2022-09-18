// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./ReadmeToken.sol";
import "./token/ERC20/ERC20.sol";
import "./token/ERC721/ERC721.sol";

// 판매 등록
contract SaleFactory is Ownable {
    address public admin;
    address[] public sales; // 토큰 별 판매 주소

    ERC20 public erc20Contract;
    ReadmeToken public readMeContract;

    // 판매 등록
    event NewSale(
        address indexed _saleContract,
        address indexed _owner
    );

    constructor(
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = msg.sender;

        erc20Contract = ERC20(_currencyAddress);
        readMeContract = ReadmeToken(_nftAddress);
    }

    // 토큰 별 판매 계약 주소
    function getSaleAddress(uint256 tokenId) public view returns (address) {
        return sales[tokenId];
    }

    /**
     * @dev 반드시 구현해야하는 함수입니다. 
     */
    function createSale (
        uint256 itemId,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime,
        bool saleType, // 경매 or 즉시 구매
        address currencyAddress,
        address nftAddress
    ) public onlyOwner returns (address) {
        
        address seller = readMeContract.ownerOf(itemId);

        erc20Contract = ERC20(currencyAddress); 
        readMeContract =  ReadmeToken(nftAddress);
        
        require(address(readMeContract) != address(0), "Invalid Address");

        require(address(erc20Contract) != address(0), "Invalid Address");

        require(msg.sender == seller, "Not your NFT");

        require(startPrice > 0, "Price is zero");

        Sale SaleContract = new Sale(
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
        readMeContract.transferFrom(seller, address(SaleContract), itemId);

        return address(SaleContract);
    }

    function allSales() public view returns (address[] memory) {
        return sales;
    }
}


contract Sale {
    address public seller;
    address public buyer;
    address admin;
    uint256 public saleStartTime; 
    uint256 public saleEndTime;
    uint256 public startPrice; // 경매: 최소입찰가, 즉시 구매가
    uint256 public tokenId;
    address public currencyAddress;
    address public nftAddress; 
    bool public saleType;
    bool public ended; 
 
    // 최고 입찰 상태
    address public highestBidder; 
    uint256 public highestBid;

    ERC20 public erc20Contract; 
    ReadmeToken public readMeContract;

    event HighestBidIncereased(address bidder, uint256 amount);
    event SaleEnded(address winner, uint256 amount);

    constructor(
        address _admin,
        address _seller,
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 startTime,
        uint256 endTime,
        bool _saleType,
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = _admin;
        seller = _seller;
        tokenId = _tokenId;
        startPrice = _startPrice;
        saleStartTime = startTime;
        saleEndTime = endTime;
        saleType = _saleType;
        currencyAddress = _currencyAddress;
        nftAddress = _nftAddress;
        ended = false;
        erc20Contract = ERC20(_currencyAddress); 
        readMeContract = ReadmeToken(_nftAddress);
    }
    
    // 가격 제안
    function bid(uint256 bid_amount) public onlySeller onlyAfterStart onlyBeforeEnd returns (bool){
        address bidder = msg.sender;

        require(bid_amount > 0, "Zero Price");
        require(erc20Contract.balanceOf(bidder) >= bid_amount, "Not enough Token");
        // require(erc20Contract.approve(address(Sale), bid_amount), "Not approved for ERC20");
        
        // 경매
        if(saleType == false) {
            require(bid_amount > startPrice, "Please Over startPrice");
            require(bid_amount > highestBid, "Your bid is lower than HighestBid");

            highestBid = bid_amount;
            highestBidder = bidder;
        }

        // 즉시 구매
        else if(saleType == true) {
            if(bid_amount < startPrice && highestBid < bid_amount){
                highestBid = bid_amount;
                highestBidder = bidder;
            } else {
                purchase(bid_amount);
            }
            
        }

        return true;
    }

    // 즉시 구매
    function purchase(uint bid_amount) public payable onlySeller onlyAfterStart onlyBeforeEnd returns (bool){

        // require(erc20Contract.approve(bidder, bid_amount), "Not approved for ERC20");
        buyer = msg.sender;

        // 소유권 이전 : Sale -> 구매자(purchaser)
        readMeContract.transferFrom(address(this), buyer, tokenId);

        // 송금 : 구매자 -> Sale
        erc20Contract.approve(address(this), bid_amount); // 권한 부여
        // Sale -> 판매자
        payable(seller).transfer(bid_amount);

        _end();

        return true;
    }


    // 판매 시간 이후 구매(경매/즉시 구매)
    function confirmItem(uint bid_amount) public payable onlySeller isSaleOver returns(bool){
        
        address confirmer = msg.sender;

        require(confirmer != address(0), "address(0) is not allowed");
        require(confirmer == highestBidder, "Your not a Highest Bidder");

        // 소유권 이전 : Sale -> 구매자(purchaser)
        readMeContract.transferFrom(address(this), confirmer, tokenId);

        // 송금 : 구매자 -> Sale
        erc20Contract.approve(address(this), bid_amount); // 권한 부여
        // Sale -> 판매자
        payable(confirmer).transfer(bid_amount);

        _end();

        return true;
    }
    
    // 판매 철회
    function cancelSales() public returns (bool) {
        address requestor = msg.sender;

        require(requestor == admin || requestor == seller, "You do not have permission");

        // 소유권 이전 : Sale -> 구매자(purchaser)
        readMeContract.transferFrom(address(this), requestor, tokenId);

        _end();

        return true;
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
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            address,
            address
        )
    {
        return (
            saleStartTime,
            saleEndTime,
            startPrice,
            tokenId,
            highestBid,
            highestBidder,
            currencyAddress,
            nftAddress
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
