// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;
    constructor (address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    }

    mapping (uint256 => uint256) public animalTokenPrices;
    uint256[] public onSaleAnimalTokenArray;

    function setForSaleAnimalToken (uint256 _animalTokenId, uint256 _price) public {
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId); // 보유자 찾기

        // 함수 실행하는 사람이 토큰이 맞는지 확인. 맞으면 넘어가고, 틀리면 String 출력.
        require(animalTokenOwner == msg.sender, "Caller is not animal token owner."); 

        // 가격이 0보다 크다는 조건.
        require(_price > 0, "Price is zero or lower.");
        
        // 가격이 0 -> 판매 등록이 안 됨. 가격이 0이 아님 -> 이미 판매 등록이 됨.
        require(animalTokenPrices[_animalTokenId] == 0, "This anmimal token is already on sale.");

        // 토큰의 주인이, 판매 권한을 넘겼는가를 확인하는 과정.
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token.");

        // 해당하는 토큰 아이디에 가격을 할당.
        animalTokenPrices[_animalTokenId] = _price;

        onSaleAnimalTokenArray.push(_animalTokenId);
    }

    function purchaseAnimalToken (uint256 _animalTokenId) public payable {
        uint256 price = animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require (price > 0, "Animal token is not on sale.");
        require (price <= msg.value, "Caller sent lower than price.");
        require(animalTokenOwner != msg.sender, "Caller is animal token owner.");

        // msg.sender에 msg.value(가격)이 token 주인에게 간다.
        payable(animalTokenOwner).transfer(msg.value);
        // safeTransferFrom (보내는 사람, 받는 사람, 보내는 대상) 
        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner, msg.sender, _animalTokenId);

        animalTokenPrices[_animalTokenId] = 0;

        for(uint256 i = 0; i < onSaleAnimalTokenArray.length; i++) {
            // price가 0인 인덱스를 없앰.
            if (animalTokenPrices[onSaleAnimalTokenArray[i]] == 0) {
                // 맨 뒤에 있던 마지막 변수를 조건문에 걸린 인덱스 자리로 옮기고, 마지막 자리를 pop() 함.
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[onSaleAnimalTokenArray.length-1];
                onSaleAnimalTokenArray.pop();
            }
        }
    }

    function getOnSaleAnimalTokenArrayLength () view public returns (uint256) {
        return onSaleAnimalTokenArray.length;
    }

    function getAnimalTokenPrice(uint256 _animalTokenId) view public returns (uint256) {
        return animalTokenPrices[_animalTokenId];
    }
}
