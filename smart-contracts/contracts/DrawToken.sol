// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./BatchMint.sol";

contract DrawToken{

  IERC20 public wooToken;
  MintReadmeToken public mintReadmeToken;

  constructor (IERC20 _wooToken, address _mintReadmeToken){
    wooToken = _wooToken;
    mintReadmeToken = MintReadmeToken(_mintReadmeToken);
  }

  // 금액
  uint256 public winnerCount;
  // 선착순 당첨자
  address[] winnerList;
  // 중복 확인
  bool who;
  // 이벤트 토큰 번호
  uint256 number = 1;

  // 호출자: winner
  function shareToken() public {
    // 해당 컨트랙트에게 50000원을 사용할 권한을 미리 줘야함
    require(winnerCount <= 50, "Over");
    address winner = msg.sender;
    address woo = mintReadmeToken.ownerOf(number);

    // 당첨자 목록 확인
    for(uint256 i = 0; i < winnerList.length;){
      if(winnerList[i] == msg.sender){
        who = true;
        break;
      }
      who = false;

      unchecked{
        ++i;
        }
    }
    require(who == false, "msg.sender is beneficiary");

    // 승인 권한 받은 컨트랙트가 winner에게 1000원 줌
    uint256 price = 1000; // Checks Effects Interaction Pattern 적용
    wooToken.transfer(msg.sender, price);
    // 당첨자 목록 추가
    winnerList.push(msg.sender);
    // 금액 수정
    winnerCount = SafeMath.add(winnerCount, 1);

    // NFT 소유권 변환
    mintReadmeToken.safeTransferFrom(woo, winner, number);

    // 다음 토큰 번호
    number += 1;
  }

  // get: 남은 인원 조회
  function getWinnerCount() public view returns(uint256){
    uint256 remainder = SafeMath.sub(50,winnerCount);

    return remainder;
  }

}