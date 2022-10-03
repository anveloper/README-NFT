// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MintReadmeToken.sol";

// 재진입 공격 방지
contract SaleReadmeToken is ReentrancyGuard{
    
    MintReadmeToken public mintReadmeToken;

    constructor (address _mintReadmeToken) {
        
        mintReadmeToken = MintReadmeToken(_mintReadmeToken);
    }

    uint constant DAY_IN_SECONDS = 86400;
    uint constant YEAR_IN_SECONDS = 31536000;
    uint constant LEAP_YEAR_IN_SECONDS = 31622400;
    uint constant HOUR_IN_SECONDS = 3600;
    uint constant MINUTE_IN_SECONDS = 60;
    uint16 constant ORIGIN_YEAR = 1970;

    struct DateTime {
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 hour;
        uint8 minute;
        uint8 second;
    }

    // 판매 등록 된 토큰 : tokenId
    uint256[] public onSaleReadmeToken;
    // 토큰 Id -> 가격
    mapping (uint256 => uint256) public readmeTokenPrice;
    // 토큰 Id -> 시간
    mapping (uint256 => uint256) public readmeTokenEndTime;
    

    // get: 판매 중인 토큰 전체 목록 조회
    function getOnSaleReadmeToken() public view returns (uint256[] memory) {
        return onSaleReadmeToken;
    }

    // get: 개별 토큰 가격 조회
    function getReadmeTokenPrice(uint256 _readmeTokenId) public view returns (uint256) {
        return readmeTokenPrice[_readmeTokenId];
    }

    // 판매 등록: seller
    function setForSaleReadmeToken(
        uint256 _readmeTokenId, 
        uint256 _price,
        uint256 _endTime
        ) public returns (DateTime memory dt) {
        
        // 판매등록하려는 주인 확인
        address readmeTokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        address seller = msg.sender;

        // 판매등록 = 주인
        require(seller == readmeTokenOwner, "Not Owner");
        // 가격은 0원 이상 설정
        require(_price > 0, "Zero Price");
        // 가격 등록 확인
        require(readmeTokenPrice[_readmeTokenId] == 0, "Not On Sale");

        // 가격 등록
        readmeTokenPrice[_readmeTokenId] = _price;
        // 시간 등록
        uint256 endTime = SafeMath.add(_endTime, block.timestamp);
        readmeTokenEndTime[_readmeTokenId] = endTime;
        // 판매 등록 목록 수정
        onSaleReadmeToken.push(_readmeTokenId);

        return parseTimestamp(endTime);
    }


    // 구매: buyer
    function purchaseReadmeToken(
        IERC20 token, 
        uint256 _readmeTokenId) public nonReentrant{   

        // 가격 및 판매 중 확인(0원일 경우 판매 하는 nft가 아님)
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address buyer = msg.sender;

        // 판매자 확인
        address readmeTokenOwner = mintReadmeToken.ownerOf(_readmeTokenId);
        
        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time out!");
        // 가격 등록 확인
        require(price > 0, "Not On Sale");
        // 구매자의 구매 능력 확인(=> 지갑 돈으로 바꿔야할 것같음)
        // require(price <= (msg.sender).balance, "No money");
        require(price <= token.balanceOf(buyer), "No Money");
        // 판매자 != 구매자 
        require(readmeTokenOwner != buyer, "Seller is not Buyer");
        
        // 송금
        token.transferFrom(msg.sender, readmeTokenOwner, price); // Checks Effects Interaction Pattern 적용
        // // 돈: 구매자(buyer: 함수 호출자) -> 판매자
        // payable(readmeTokenOwner).transfer(msg.value);

        // nft 전송: 판매자 -> 구매자
        mintReadmeToken.safeTransferFrom(readmeTokenOwner, buyer, _readmeTokenId);

        // 권한 부여
        mintReadmeToken.approveNFT(buyer, address(this), true);
        
        // 가격을 수정(가격 = 0: 판매중아님)
        readmeTokenPrice[_readmeTokenId] = 0;
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length;) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
                break;
            }
            unchecked{
                ++i;
            }
        }

        // 소유 토큰 목록 수정
        mintReadmeToken.removeTokenFromList(buyer, readmeTokenOwner, _readmeTokenId);
    }

    // 판매 취소
    function cancelReadmeToken(uint256 _readmeTokenId) public {
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address cancel = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);


        // 시간 확인
        require(block.timestamp < readmeTokenEndTime[_readmeTokenId], "Time out!");
        // 가격 등록 확인
        require(price > 0, "Not On Sale");
        // 취소자 == 판매자 
        require(cancel == seller, "No Owner");
        
        
        // 가격을 수정
        readmeTokenPrice[_readmeTokenId] = 0;
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length;) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
                break;
            }

            unchecked{
                ++i;
            }
        }
    }

    // 미판분
    function refundsReadmeToken(uint256 _readmeTokenId) public {
        uint256 price = readmeTokenPrice[_readmeTokenId];
        address refund = msg.sender;
        // 판매자 확인
        address seller = mintReadmeToken.ownerOf(_readmeTokenId);
        
        // 취소자 == 판매자 
        require(refund == seller, "No Owner");
        // 시간 확인
        require(block.timestamp > readmeTokenEndTime[_readmeTokenId], "Time out!");
        // 가격 등록 확인
        require(price > 0, "Not On Sale");
        
        // 가격을 수정
        readmeTokenPrice[_readmeTokenId] = 0;
        
        // 판매 중 목록 수정
        for(uint256 i = 0; i < onSaleReadmeToken.length;) {
            if(readmeTokenPrice[onSaleReadmeToken[i]] == 0){
                onSaleReadmeToken[i] = onSaleReadmeToken[onSaleReadmeToken.length-1];
                onSaleReadmeToken.pop();
                break;
            }
            unchecked{
                ++i;
            }
        }
    }


    

    // 시간 반환
    function parseTimestamp(uint timestamp) public pure returns (DateTime memory dt) {
        uint secondsAccountedFor = 0;
        uint buf;
        uint8 i;

        // 연
        dt.year = getYear(timestamp);
        buf = leapYearsBefore(dt.year) - leapYearsBefore(ORIGIN_YEAR);

        secondsAccountedFor += LEAP_YEAR_IN_SECONDS * buf;
        secondsAccountedFor += YEAR_IN_SECONDS * (dt.year - ORIGIN_YEAR - buf);

        // 월
        uint secondsInMonth;
        for (i = 1; i <= 12; i++) {
                secondsInMonth = DAY_IN_SECONDS * getDaysInMonth(i, dt.year);
                if (secondsInMonth + secondsAccountedFor > timestamp) {
                        dt.month = i;
                        break;
                }
                secondsAccountedFor += secondsInMonth;
        }

            // 일
            for (i = 1; i <= getDaysInMonth(dt.month, dt.year); i++) {
                    if (DAY_IN_SECONDS + secondsAccountedFor > timestamp) {
                            dt.day = i;
                            break;
                    }
                    secondsAccountedFor += DAY_IN_SECONDS;
            }

            // 시간
            dt.hour = getHour(timestamp);

            // 분
            dt.minute = getMinute(timestamp);

            // 초
            dt.second = getSecond(timestamp);

        return dt;

    }

    // get: 연도 조회
    function getYear(uint timestamp) public pure returns (uint16) {
        uint secondsAccountedFor = 0;
        uint16 year;
        uint numLeapYears;

        // Year
        year = uint16(ORIGIN_YEAR + timestamp / YEAR_IN_SECONDS);
        numLeapYears = leapYearsBefore(year) - leapYearsBefore(ORIGIN_YEAR);

        secondsAccountedFor += LEAP_YEAR_IN_SECONDS * numLeapYears;
        secondsAccountedFor += YEAR_IN_SECONDS * (year - ORIGIN_YEAR - numLeapYears);

        while (secondsAccountedFor > timestamp) {
                if (isLeapYear(uint16(year - 1))) {
                        secondsAccountedFor -= LEAP_YEAR_IN_SECONDS;
                }
                else {
                        secondsAccountedFor -= YEAR_IN_SECONDS;
                }
                year -= 1;
        }
        return year;
    }

    // get: 월 조회
    function getMonth(uint timestamp) public pure returns (uint8) {
            return parseTimestamp(timestamp).month;
    }

    // get: 일 조회
    function getDay(uint timestamp) public pure returns (uint8) {
            return parseTimestamp(timestamp).day;
    }

    // get: 시 조회
    function getHour(uint timestamp) public pure returns (uint8) {
            return uint8((((timestamp + 32400) / 60 / 60) % 24));
    }

    // get: 분 조회
    function getMinute(uint timestamp) public pure returns (uint8) {
            return uint8((timestamp / 60) % 60);
    }

    // get: 초 조회
    function getSecond(uint timestamp) public pure returns (uint8) {
            return uint8(timestamp % 60);
    }

    // 윤년 계산
    function isLeapYear(uint16 year) public pure returns (bool) {
        if (year % 4 != 0) {
                return false;
        }
        if (year % 100 != 0) {
                return true;
        }
        if (year % 400 != 0) {
                return false;
        }
        return true;
    }

    // 연도 계산
    function leapYearsBefore(uint year) public pure returns (uint) {
            year -= 1;
            return year / 4 - year / 100 + year / 400;
    }

    // 일 계산
    function getDaysInMonth(uint8 month, uint16 year) public pure returns (uint8) {
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                    return 31;
            }
            else if (month == 4 || month == 6 || month == 9 || month == 11) {
                    return 30;
            }
            else if (isLeapYear(year)) {
                    return 29;
            }
            else {
                    return 28;
            }
    }



}


