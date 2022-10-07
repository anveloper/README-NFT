// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MintReadmeToken.sol";
import "./SaleReadmeToken.sol";

contract DrawToken is ReentrancyGuard{

  IERC20 public wooToken;
  SaleReadmeToken public saleReadmeToken;
  MintReadmeToken public mintReadmeToken;

  constructor (IERC20 _wooToken, address _mintReadmeToken, address _saleReadmeToken)
  {
    wooToken = _wooToken;
    mintReadmeToken = MintReadmeToken(_mintReadmeToken);
    saleReadmeToken = SaleReadmeToken(_saleReadmeToken);
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
  function shareToken() public nonReentrant{
    // 해당 컨트랙트에게 50000원을 사용할 권한을 미리 줘야함
    require(winnerCount < 50, "Over");
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
    
    // 당첨자 목록 추가
    winnerList.push(msg.sender);
    // 당첨자 수 수정
    winnerCount = SafeMath.add(winnerCount, 1);
    // NFT 소유권 변환
    mintReadmeToken.transferFrom(woo, winner, number);
    // 소유 토큰 목록 수정
    mintReadmeToken.removeTokenFromList(winner, woo, number);

    mintReadmeToken.approveNFT(winner, address(saleReadmeToken), true); // 권한 부여

    // 다음 토큰 번호
    number += 1;
  }

  // get: 남은 인원 조회
  function getWinnerCount() public view returns(uint256){
    uint256 remainder = SafeMath.sub(50,winnerCount);

    return remainder;
  }

}