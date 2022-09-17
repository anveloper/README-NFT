// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./token/ERC20/ERC20.sol";
import "./token/ERC721/ERC721.sol";
import "./NFTCreater.sol";

/**
 *  PJT Ⅲ - Req.1-SC2) Sale 구현
 */
 // 판매 중 상태
 // 조건이 맞으면 거래가 발생함
contract Sale {
    // 생성자에 의해 정해지는 값
    address public seller; // 판매자 정보 = nft 소유자
    address public buyer; // 구매자 정보
    address admin; // 수퍼권한자 정보 = 우리는 판매등록한 사람 = nft 소유자
    uint256 public saleStartTime;  // 판매 시작 시간
    uint256 public saleEndTime; // 판매 종료 시간
    uint256 public minPrice; // 입찰가
    uint256 public purchasePrice; // 판매된 가격
    uint256 public tokenId; // 거래 nft 
    address public currencyAddress;// 거래시 사용할 ERC-20(돈?)의 주소
    address public nftAddress; // 판매 nft 주소
    bool public saletype; // 즉시 구매(true)와 경매(false)를 구분
    bool public ended; // 판매 상태(종료 여부)

    // 경매 시, 최고 입찰 상태
    address public highestBidder; // 입찰자
    uint256 public highestBid; // 입찰가격

    // 즉시 구매 시, 최고 입찰 상태
    address public NowhighestBidder;
    uint256 public NowhighestBid;

    // IERC20 public erc20Contract;
    // IERC721 public erc721Constract;

    ERC20 public erc20Contract; // 주고받을 토큰의 컨트랙트(SSF가 ERC-20으로 구현되어 있음)
    NFTCreater public readMeContract; // 발행한 NFT의 계약이므로, 컨트랙트 추가

    event HighestBidIncereased(address bidder, uint256 amount);
    event SaleEnded(address winner, uint256 amount);

    constructor(
        address _admin,
        address _seller,
        uint256 _tokenId,
        uint256 _minPrice,
        uint256 _purchasePrice,
        uint256 startTime,
        uint256 endTime,
        bool _saletype,
        address _currencyAddress,
        address _nftAddress
    ) {
        require(_minPrice > 0);
        tokenId = _tokenId;
        minPrice = _minPrice;
        purchasePrice = _purchasePrice;
        seller = _seller;
        admin = _admin;
        saleStartTime = startTime;
        saleEndTime = endTime;
        saletype = _saletype;
        currencyAddress = _currencyAddress;
        nftAddress = _nftAddress;
        ended = false;
        // erc20Contract = IERC20(_currencyAddress);
        // erc721Constract = IERC721(_nftAddress);
        erc20Contract = ERC20(_currencyAddress); 
        readMeContract = NFTCreater(_nftAddress);
    }

  
    // 가격 제안 = 경매, 입찰
    function bid(uint256 bid_amount) public onlySeller onlyAfterStart{
        // 입찰자
        address bidder = msg.sender;
        // 잔액이 있는 경우 거래 가능
        require(erc20Contract.balanceOf(bidder) >= bid_amount, "Not enough Token");
        
        // 판매 종료 시간일 경우, 공통으로 최고 입찰가에게 구매

        // 경매일 경우, 입찰가 이상의 금액을 제시
        if(saletype == false) {
            require(bid_amount > minPrice);
            if(bid_amount > highestBid) {
                highestBid = bid_amount;
                highestBidder = bidder;
            }
        }
        // 즉시 구매일 경우, 최소가보다 적은 금액들이 입력됨
        else if(saletype == true) {
            if(bid_amount < minPrice && NowhighestBid < bid_amount) {
                NowhighestBid = bid_amount;
                NowhighestBidder = bidder;
            }
            else if(bid_amount >= minPrice) {
                purchase();
            }
        }

        confirmItem();
    }

    // 즉시 구매
    function purchase() public payable onlySeller onlyAfterStart{
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


    // modifier를 사용하여 함수 동작 조건을 재사용하는 것을 권장합니다. 
    modifier onlySeller() {
        require(msg.sender != seller, "Sale: You are not seller.");
        _;
    }

    // 판매는 판매 시각 이후에만 진행됨
    modifier onlyAfterStart() {
        require(
            block.timestamp >= saleStartTime,
            "Sale: This sale is not valid."
        );
        _;
    }

    // 판매 종료 시점 이후 판매
    modifier isSaleOver() {
        require(
            block.timestamp > saleEndTime,
            "Now Sale"
        );
        _;
    }
}
