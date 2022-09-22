// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract BidReadmeToken{
    MintReadmeToken public mintReadmeTokenAddress;
    SaleReadmeToken public saleReadmeToken;

    constructor (address _mintReadmeTokenAddress, address _saleReadmeToken) {
        mintReadmeTokenAddress = MintReadmeToken(_mintReadmeTokenAddress);
        saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
    }

    // 경매에 판매 등록된 토큰 저장리스트
    // 토큰 별 가격 저장
    // 토큰 별 시간 저장
    // 입찰자별 입찰 가격 저장 리스트
    // 최고가 저장
    // 최고가 입찰자 주소 저장

    // 경매 등록
        // 주인 확인
        // 등록 가격 확인
        // 판매 등록이 되었는지 확인
        // 권한 확인
        // setForSaleReadmeToken에서 경매 등록이 되었는지 확인하는 코드 추가해주세요

        // 가격 등록
        // 시간 등록
        // 경매 등록 목록 수정

    // 입찰
        // 경매 중 확인
        // 입찰 능력 확인
        // 입찰가가 현재 최고가 인지 확인
        // 입찰자가 판매자인지 확인
        // 시간 확인

        // 입찰자와 입찰 금액 저장 : 입찰 목록 출력시 필요
        // 최고가 변경
        // 최고 입찰가 변경

    // 낙찰
        // 종료 시간 확인
        // 경매 증 확인
        // 구매 능력 확인
        // 낙찰자가 판매자이지 확인

        // 토큰(돈) 전송
        // nft 전송

        // 낙찰된 nft가 판매되었으니 판매 가격을 0으로 수정

        // 경매 중 목록 수정: 판매된 nft를 목록에서 제거

        // 소유한 토큰 목록 수정

    // 경매 취소
        
        // 호출자가 판매자인지 확인
        // 경매 중 확인
        // 시간 확인
        
        // 판매 가격을 0으로 수정하여 경매 목록에서 제외
        // 경매 중 목록 수정

    // 경매 중인 토큰 정보 조회
        // 위에 구조체를 선언해서 필요한 정보(tokenid, 가격, 소유주, 메타데이터)를 선언
    // (여기다 하고 싶은데 안되면 GetReadmeToken으로 이동해서..)

}
