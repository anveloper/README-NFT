// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./ReadmeToken.sol";
import "./token/ERC20/ERC20.sol";
import "./token/ERC721/ERC721.sol";

// 판매 등록
contract SaleFactory is Ownable {
    address public admin;
    uint256[] public onSaleAnimalTokenArray; // 판매 중 토큰 기록
    mapping(uint256 => address) public sales;

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

        erc20Contract = IERC20(_currencyAddress);
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
        
        erc20Contract = ERC20(currencyAddress); 
        readMeContract =  ReadmeToken(nftAddress);
        
        require(readMeContract != address(0), "Invalid Address");

        require(msg.sender == readMeContract.ownerOf(itemId), "Not your NFT");

        require(startPrice > 0, "Price is zero");

        Sale SaleContract = new Sale(
            admin,
            itemId,
            startPrice,
            startTime,
            endTime,
            saleType,
            currencyAddress,
            nftAddress
        );

        sales[itemId] = address(SaleContract);
        onSaleAnimalTokenArray.push(itemId);

        // Sale 컨트랙트로의 (임시)소유권 이전
        readMeContract.transferFrom(address(this), address(SaleContract), itemId);

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
    uint256 public startPrice;
    uint256 public purchasePrice;
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
        uint256 _purchasePrice,
        uint256 startTime,
        uint256 endTime,
        bool _saleType,
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = _admin;
        seller = _seller;
        tokenId = _tokenId;
        startPrice = startPrice;
        purchasePrice = _purchasePrice;
        saleStartTime = startTime;
        saleEndTime = endTime;
        saleType = _saleType;
        currencyAddress = _currencyAddress;
        nftAddress = _nftAddress;
        ended = false;
        erc20Contract = ERC20(_currencyAddress); 
        readMeContract = ReadmeToken(_nftAddress);
    }

    function bid(uint256 bid_amount) public onlySeller onlyAfterStart onlyBeforeEnd returns (bool){
        address bidder = msg.sender;

        require(erc20Contract.balanceOf(bidder) >= bid_amount, "Not enough Token");
        require(erc20Contract.approve(bidder, bid_amount), "Not approved for ERC20");
        
        // 경매
        if(saletype == false) {
            require(bid_amount > highestBid, "Your bid is lower than HighestBid");

            highestBid = bid_amount;
            highestBidder = bidder;
        }
        // 즉시 구매
        else if(saletype == true) {
            require(bid_amount > purchasePrice, "Your bid is lower than purchasePrice");
            purchase();
        }

        return true;
    }


    function purchase() public payable onlySeller onlyAfterStart onlyBeforeEnd returns (bool){
        address purchaser = msg.sender;
        
        require(erc20Contract.approve(bidder, bid_amount), "Not approved for ERC20");
        // 구매자가 Sale한테 특정 금액만큼 송금 권한 주기
        erc20Contract.approve(address(this), NowhighestBid);
        // 가격 지불(송금)
        payable(NowhighestBidder).transfer(NowhighestBid);
        // 소유권 이전
        readMeContract.safeTransferFrom(address(this), NowhighestBidder, tokenId);

        _end();
    }


    // 구매 완료 : 판매 종료 시각 이후 최고 입찰가가 구매 완료를 하는 함수
    function confirmItem() public payable onlySeller isSaleOver{
        // 구매자가 Sale한테 특정 금액만큼 송금 권한 주기
        erc20Contract.approve(address(this), NowhighestBid);
        // 가격 지불(송금)
        payable(NowhighestBidder).transfer(NowhighestBid);
        // 소유권 이전
        readMeContract.safeTransferFrom(address(this), NowhighestBidder, tokenId);
        _end();
    }
    
    // 판매 철회
    function cancelSales() public {
        // TODO
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
            uint256,
            address,
            address
        )
    {
        return (
            saleStartTime,
            saleEndTime,
            minPrice,
            purchasePrice,
            tokenId,
            highestBidder,
            highestBid,
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
        require(block.timestamp < saleEndTime, "Time over");
        _;
    }
}
