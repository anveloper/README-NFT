// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MintReadmeToken.sol";

contract DrawToken{

  // 돈이 빠져나갈 주소
  IERC20 public wooToken;

  constructor (IERC20 _wooToken){
    wooToken = _wooToken;
  }

  // 금액
  uint256 public withdraw;
  // 선착순 당첨자
  address[] winnerList;
  // 중복 확인
  bool who;

  event Logs (
    uint256 withdrawToken
  );

  // 호출자: winner
  function shareToken() public {
    // 해당 컨트랙트에게 50000원을 사용할 권한을 미리 줘야함
    require(withdraw < 50000, "Over");

    // 당첨자 목록 확인
    for(uint256 i = 0; i < winnerList.length; i++){
      if(winnerList[i] == msg.sender){
        who = true;
        break;
      }
      who = false;
    }
    require(who == false, "msg.sender is beneficiary");

    // 승인 권한 받은 컨트랙트가 winner에게 1000원 줌
    wooToken.transfer(msg.sender, 1000);
    // 당첨자 목록 추가
    winnerList.push(msg.sender);
    // 금액 수정
    withdraw += 1000;

    emit Logs(withdraw);
  }

}