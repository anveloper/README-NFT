// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";

contract DrawToken{

  IERC20 public wooToken;

  constructor (IERC20 _wooToken){
    wooToken = _wooToken;
  }

  // 금액
  uint256 public winnerCount;
  // 선착순 당첨자
  address[] winnerList;
  // 중복 확인
  bool who;

  // 호출자: winner
  function shareToken() public {
    // 해당 컨트랙트에게 50000원을 사용할 권한을 미리 줘야함
    require(winnerCount < 50, "Over");

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
    wooToken.transfer(msg.sender, 1000);
    // 당첨자 목록 추가
    winnerList.push(msg.sender);
    // 금액 수정
    winnerCount += 1;

  }

  // get: 남은 인원 조회
  function getWinnerCount() public view returns(uint256){
    uint256 remainder = 50 - winnerCount;

    return remainder;
  }
}