// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";


contract SaleReadmeToken{
    MintReadmeToken public mintReadmeToken;

    constructor (address _mintReadmeToken) {
        mintReadmeToken = MintReadmeToken(_mintReadmeToken);
    }

    // 판매 등록 된 토큰 : tokenId
    uint256[] public onSaleReadmeToken;
    // 토큰 Id -> 가격
    mapping (uint256 => uint256) public readmeTokenPrice;
    // 토큰 Id -> 시간
    mapping (uint256 => uint256) public readmeTokenEndTime;
    // 판매/경매에 등록된 토큰
    mapping(uint256 => bool) onActiveTokens;


    // 판매 등록: seller
    function setForSaleReadmeToken(
        uint256 _readmeTokenId, 
        uint256 _price,
        uint256 _endTime
        ) public {
        
        // 판매등록하려는 주인 확인
        address readmeTokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        address seller = msg.sender;

        // 판매등록 = 주인
        require(seller == readmeTokenOwner, "Not Owner");
        // 가격은 0원 이상 설정
        require(_price > 0, "Zero Price");
        // 판매/경매 등록 여부 확인
        require(onActiveTokens[_readmeTokenId] != true, "Already on Sale");
        // 판매 등록 확인
        require(readmeTokenPrice[_readmeTokenId] == 0, "Already On Sale");
        
        // 가격 등록
        readmeTokenPrice[_readmeTokenId] = _price;
        // 시간 등록
        uint256 endTime = _endTime + block.timestamp;
        readmeTokenEndTime[_readmeTokenId] = endTime;
        // 판매 등록 목록 수정
        onSaleReadmeToken.push(_readmeTokenId);
        // 판매/경매 등록으로 변경
        onActiveTokens[_readmeTokenId] = true;

        // 전송 권한 부여
        // mintReadmeToken.approve(address(this), _readmeTokenId);
    }

    // 구매: buyer
    function purchaseReadmeToken(uint256 _readmeTokenId) public payable{
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address buyer = msg.sender;

        // 판매자 확인
        address readmeTokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time out!");
        // 판매중 확인
        require(price > 0, "Not On Sale");
        // 판매/경매 등록 여부 확인
        require(onActiveTokens[_readmeTokenId] == true, "Not on Sale");
        // 구매자의 구매 능력 확인
        require(price <= msg.value, "No money");
        // 판매자 != 구매자 
        require(readmeTokenOwner != buyer, "Seller is not Buyer");
        
        // 돈: 구매자(buyer: 함수 호출자) -> 판매자
        payable(readmeTokenOwner).transfer(msg.value);
        // nft 전송: 판매자 -> 구매자
        mintReadmeToken.safeTransferFrom(readmeTokenOwner, buyer, _readmeTokenId);
        
        // 가격을 수정해서 판매가 아닌 거로 함(가격 = 0: 판매중아님)
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        setIsActive(_readmeTokenId, false);
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length; i++) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
                break;
            }
        }

        // 소유 토큰 목록 수정
        mintReadmeToken.removeTokenFromList(buyer, readmeTokenOwner, _readmeTokenId);
    }

    // 판매 취소
    function cancelReadmeToken(uint256 _readmeTokenId) public {
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address cancel = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);
        
        // 취소자 == 판매자 
        require(cancel == seller, "No Owner");
        // 판매중 확인
        require(price > 0, "Not On Sale");
        // 판매/경매 등록 여부 확인
        require(onActiveTokens[_readmeTokenId] == true, "Not on Sale");
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time out!");
        
        // 가격을 수정해서 판매가 아닌 거로 함(가격 = 0: 판매중아님)
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        setIsActive(_readmeTokenId, false);
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length; i++) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
            }
        }
    }

    // 미판분
    function refundsReadmeToken(uint256 _readmeTokenId) public {
        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address refund = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);
        
        // 취소자 == 판매자 
        require(refund == seller, "No Owner");
        // 판매중 확인
        require(price > 0, "Not On Sale");
        // 판매/경매 등록 여부 확인
        require(onActiveTokens[_readmeTokenId] == true, "Not on Sale");
        // 시간 확인
        require(block.timestamp > readmeTokenEndTime[_readmeTokenId], "Time out!");
        
        // 가격을 수정해서 판매가 아닌 거로 함(가격 = 0: 판매중아님)
        readmeTokenPrice[_readmeTokenId] = 0;
        // 판매 중 목록에서 제거
        setIsActive(_readmeTokenId, false);
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length; i++) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
            }
        }
    }

    // get: 판매 중인 토큰 개수 조회
    function getOnSaleReadmeTokenArrayLength() public view returns (uint256) {
        return onSaleReadmeToken.length;
    }

    // get: 판매 중인 토큰 전체 목록 조회
    function getOnSaleReadmeToken() public view returns (uint256[] memory) {
        return onSaleReadmeToken;
    }

    // get: 개별 토큰 가격 조회
    function getReadmeTokenPrice(uint256 _readmeTokenId) public view returns (uint256) {
        return readmeTokenPrice[_readmeTokenId];
    }

    // 판매/경매 상태 확인
    function getIsActive(uint256 _tokenId) public view returns (bool) {
        return onActiveTokens[_tokenId];
    }

    // 판매/경매 상태 변경
    function setIsActive(uint _tokenId, bool check) public {
        onActiveTokens[_tokenId] = check;
    }

}
