// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MintReadmeToken.sol";

contract BatchMint is ERC721Enumerable, Ownable{

  string public metadataURI;

  // tokenId -> metadata
  mapping(uint256 => string) metadataURIs;

  constructor(string memory _metadataURI) ERC721("ReadmeEvnetNFT", "REN") {
    metadataURI = _metadataURI;
  }

  function batchNFT(uint _amount, address _drawToken) public {
    address own = msg.sender;
    for(uint i = 0; i < _amount;){
      
      uint256 newTokenId = SafeMath.add(totalSupply(), 1);
      
      _mint(own, newTokenId); // 민팅

      _approve(_drawToken, newTokenId); // 권한 부여
      
      metadataURIs[newTokenId] = tokenURI(newTokenId);
      
      unchecked{
        ++i;
      }
    }
  }

  // get: tokenId -> metadata
  function tokenURI(uint _tokenId) override public view returns (string memory){
    return string(abi.encodePacked(metadataURI, '/', _tokenId, '.json'));
  } 
}