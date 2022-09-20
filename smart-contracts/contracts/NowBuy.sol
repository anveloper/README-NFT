// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./token/ERC20/IERC20.sol";
import "./token/ERC721/IERC721.sol";
import "./ReadmeToken.sol";

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
