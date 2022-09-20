// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/IERC721.sol";
import "./ReadmeToken.sol";

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
    address public nowAddress;
    bool public ended; 
 
    // 최고 입찰 상태
    address public highestBidder; 
    uint256 public highestBid;

    IERC20 public erc20Contract; 
    IERC721 public erc721Contract;
    ReadmeToken public readmeContract;

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
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 _startTime,
        uint256 _endTime,
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

        readmeContract = ReadmeToken(nowAddress);

        readmeContract.removeTokenFromList(purchaser, seller, tokenId);

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

// 경매 구매
contract NowBuy {
    address public seller;
    address public buyer;
    uint256 public fixedPrice;
    uint256 public saleStartTime; 
    uint256 public saleEndTime;
    uint256 public tokenId;
    address public currencyAddress;
    address public nftAddress;
    address public nowAddress;
    bool public ended;

    mapping(address => uint256) offers; // 제안자들의 주소에 대해서 제안 가격을 mapping
    address[] offersAddress;
    uint256 public offersIndex; // 오퍼 배열의 길이

    IERC20 public erc20Contract; 
    IERC721 public erc721Contract;
    ReadmeToken public readmeContract;

    event OfferMade(address _nowBuyContract, uint256 _tokenId, address _offer, uint256 _amount);
    event BuyNow(address _nowBuyContract, uint256 _tokenId, address _buyer, uint256 _amount);
    event AcceptOffer(address _nowBuyContract, uint256 _tokenId, address _offer, uint256 _amount);

    constructor(
        address _seller,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _fixedPrice,
        uint256 _tokenId,
        address _currencyAddress,
        address _nftAddress
    ) {
        seller = _seller;
        tokenId = _tokenId;
        fixedPrice = _fixedPrice;
        saleStartTime = _startTime;
        saleEndTime = _endTime;
        currencyAddress = _currencyAddress;
        nftAddress = _nftAddress;
        ended = false;
        erc20Contract = IERC20(_currencyAddress);
        erc721Contract = IERC721(_nftAddress);
    }
    
    // 가격 제안
    function makeOffer(uint256 offer_amount) public returns (bool) {
        address offer = msg.sender;
        require(offer_amount > 0, "Offered Zero Price");
        require(erc20Contract.approve(offer, offer_amount), "Not Approved for ERC20");
        require(erc20Contract.balanceOf(offer) >= offer_amount, "Not Enough Token");
        require(offer_amount < fixedPrice, "Can't Make Offer Price Too High");

        // 송금: 구매자 -> Sale
        erc20Contract.approve(offer, offer_amount);
        // 배열에 푸시
        offersAddress.push(offer);

        // 제안한 사람이 또 한번 제안했을 경우
        if (offers[offer] != 0 ) { // 이미 오퍼한 가격이 있으면 환불해준 다음에 진행
            erc20Contract.transferFrom(address(this), offer, offers[offer]); // 컨트랙트에서 돈을 뺌
            offers[offer] = 0; // 구매자 주소에 대한 입금액을 0원으로 함
        }

        erc20Contract.transferFrom(offer, address(this), offer_amount);
        
        offers[offer] = offer_amount;

        emit OfferMade(address(this), tokenId, offer, offer_amount);

        return true;
    }

    // 즉시 구매(fixedPrice를 전달하면 됨)
    function buyNow() public onlySeller returns (bool) {
        address _buyer = msg.sender; // 구매자(함수 호출자)

        // 소유권 이전 : Sale -> 구매자(buyer)
        erc721Contract.transferFrom(address(this), _buyer, tokenId);
        readmeContract = ReadmeToken(nowAddress);
        readmeContract.removeTokenFromList(_buyer, seller, tokenId);

        // 송금 : 구매자 -> Sale
        erc20Contract.approve(_buyer, fixedPrice); // 권한 부여

        erc20Contract.transferFrom(_buyer, seller, fixedPrice);

        // 남은 오퍼 금액을 반환시켜줘야함
        refund(_buyer);

        _end();

        emit BuyNow(address(this), tokenId, _buyer, fixedPrice);

        return true;
    }

    // 가격 제안 수락 
    function acceptOffer(uint offer_amount, address _offer) public payable onlySeller onlyAfterStart onlyBeforeEnd returns (bool){
    
        address _seller = msg.sender; // 이 함수를 호출하는 사람은 판매자
        
        // 소유권 이전 : Sale -> 구매자(offer)
        erc721Contract.transferFrom(address(this), _offer, tokenId);
        readmeContract = ReadmeToken(nowAddress);
        readmeContract.removeTokenFromList(_offer, seller, tokenId);

        // 송금
        erc20Contract.transferFrom(_offer, _seller, offer_amount);

        // 기존에 있던 오퍼 금액들을 주인에게 돌려줘야함
        refund(_offer);

        _end();

        emit AcceptOffer(address(this), tokenId, _offer, fixedPrice);

        return true;
    }

    // 판매 종료
    function close() public isSaleOver returns(bool) {

        // 소유권 이전 : Sale -> seller
        erc721Contract.transferFrom(address(this), seller, tokenId);
        // address 
        refund(address(0));
        
        _end();

        return true;
    }

    // 환불
    function refund(address _buyer) public {

        uint256 arrLength = offersAddress.length;

        for (uint i=0; i<arrLength; i++) {
            if (_buyer == offersAddress[i]) {
                continue;
            } else {
                address add = offersAddress[i];
                uint256 refundCost = offers[add];
                erc20Contract.transferFrom(address(this), add, refundCost);
            }
        }
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
            address,
            address
        )
    {
        return (
            saleStartTime,
            saleEndTime,
            fixedPrice,
            tokenId,
            currencyAddress,
            nftAddress
        );
    }

    // internal 혹은 private 함수 선언시 아래와 같이 _로 시작하도록 네이밍합니다.
    function _end() internal {
        ended = true;
    }

    // 잔액 반환
    function _getCurrencyAmount() private view returns (uint256) {
        return erc20Contract.balanceOf(msg.sender);
    }

    // 오퍼한 사람별 가격 조회
    function _getOffers() private view returns (address[] memory) {
        address[] memory arr = new address[](offersIndex);

        return arr;
    }
 
    modifier onlySeller() {
        require(msg.sender != seller, "Sale: You are not seller.");
        _;
    }

    modifier onlyAfterStart() { 
        require(block.timestamp >= saleStartTime, "Time yet"); // 블록의 시작 시간이 판매 시작 시간보다 이후여야 함
        _;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp <= saleEndTime, "Time over"); // 판매 종료 시간이 블록의 시작 시간보다 이전이어야 함
        _;
    }

    modifier isSaleOver() {
        require(block.timestamp > saleEndTime, "Time over");
        _;
    }
}

