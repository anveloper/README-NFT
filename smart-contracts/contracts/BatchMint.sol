// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MintReadmeToken.sol";

contract BatchMint is ERC721Enumerable, Ownable{

  string public metadataURI = 'ipfs.io/ipfs/QmcXmGLeFNbVzAWjYxGiv3u9mqiyqX7kQTveH8WuYWLfxR';

  constructor() ERC721("ReadmeEvnetNFT", "REN") {} 

  // get: tokenId -> metadata
  function tokenURI(uint _tokenId) override public view returns (string memory){
    return string(abi.encodePacked(metadataURI, '/', _tokenId, '.json'));
  } 
}