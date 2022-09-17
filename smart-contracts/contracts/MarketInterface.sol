// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./access/Ownable.sol";
import "./NFTCreater.sol";
import "./token/ERC20/ERC20.sol";
import "./Sale.sol";


/**
 * PJT Ⅲ - Req.1-SC1 MarketInterface 구현
 * 상태 변수나 함수의 시그니처, 이벤트는 구현에 따라 변경할 수 있습니다.
 */

 // 판매 등록 승인 바로 직전 상태
 // 판매 등록을 함과 동시에, Sale을 호출하여 판매 로직을 호출하여 사용할 수 있음
contract MarketInterface is Ownable {
    address public admin; // 모든 Sale의 권한을 갖는 관리자
    address[] public sales;// 특정 NFT가 어떤 Sale contract에서 거래가 이루어졌는기 기록

    ERC20 public erc20Contract; // 주고받을 토큰의 컨트랙트(SSF가 ERC-20으로 구현되어 있음)
    NFTCreater public readMeContract; // 발행한 NFT의 계약이므로, 컨트랙트 추가

    // 판매를 기록할 events
    event NewSale(
    );

     // 이 판매에 판매할 nft와, 사용할 돈의 주소
    constructor(
        address _currencyAddress,
        address _nftAddress
    ) {
        admin = msg.sender;

        // 특정 Contract
        erc20Contract = ERC20(_currencyAddress); 
        readMeContract = ERC721(_nftAddress);
    }

    // Sale Contract를 반환하는 함수
    function getSaleAddress(uint256 tokenId) public view returns (address) {
        return sales[tokenId];
    }

    /**
     * @dev 반드시 구현해야하는 함수입니다. 
     */
     // Sale Contract 호출
     // Sale 주소 반환
    function createSale (
        address seller, // 판매자 주소
        uint256 itemId, // 판매 nft Id(tokenId)
        uint256 minPrice, // 최소 가격 = 등록 가격
        uint256 purchasePrice, // 판매된 가격
        uint256 startTime, // 판매 시작 시간
        uint256 endTime, // 판매 마감 시간
        bool saletype, // 즉시 구매(true)와 경매(false)를 구분
        // 컨트랙트간 호출에는 어느 위치(Address)에 있는지 알아야 하므로
        address currencyAddress, // 거래시 사용할 ERC-20(돈?)의 주소
        address nftAddress // 판매 nft 주소
    ) public onlyOwner returns (address) { // 판매 등록은 한 사람만이 판매를 할 수 있음
        
        erc20Contract = ERC20(currencyAddress); 
        readMeContract =  NFTCreater(nftAddress);
        
        // 판매자 주소 유효성 검사
        require(seller != address(0), "Invalid Address");

        // 주인만 판매할 수 있음
        // ownerOf 내부 정의에 따라, 토큰의 존재는 확인됨
        require(seller == readMeContract.ownerOf(itemId), "Not your NFT");

        // Sale Contract 생성
        Sale SaleContract = new Sale(
            admin,
            seller,
            itemId,
            minPrice,
            purchasePrice,
            startTime,
            endTime,
            saletype,
            currencyAddress,
            nftAddress
        );

        sales.push(address(SaleContract));

        // 판매자가 판매할 NFT를 SaleContract에 주어서
        // SaleContract가 해당 NFT를 가지고 거래를 진행할 것임
        readMeContract.safeTransferFrom(seller, address(SaleContract), itemId);

        return address(SaleContract);
  
    }

    // 생성된 모든 Sale Contract 주소 반환
    function allSales() public view returns (address[] memory) {
        return sales;
    }

    
}
