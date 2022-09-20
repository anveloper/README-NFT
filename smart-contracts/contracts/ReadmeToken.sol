// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./token/ERC721/ERC721.sol";
import "./access/Ownable.sol";


contract ReadmeToken is ERC721, Ownable{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // 내 소유 nft
    mapping(address => string[]) private _ownedTokens;

    // 내가 그린 nft
    mapping(address => uint256[]) private _drawTokens;

    // metadataURI
    mapping(uint256 => string) metadataURIs;


    // 생성된 토큰 확인
    event Mint(
        uint256 indexed tokenId,
        address indexed owner,
        string indexed metadataURI
    );

    constructor() ERC721("ReadmeNFT", "RMN") {}

    function current() public view returns (uint256) {
        return Counters.current(_tokenIds);
    }

    // metadataURI 출력
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(metadataURIs[tokenId]));
    }

    // 소유한 NFT 조회
    function getOwnedTokens(address owner) public view returns (string[] memory) {
        require (owner != address(0), "Not your nft");
        return _ownedTokens[owner];
    }

    // 내가 그린 NFT 조회
    function getDrawTokens(address owner) public view returns (uint256[] memory) {
        require (owner != address(0), "Not your draw");
        return _drawTokens[owner];
    }

    // NFT 발행
    function create(string memory _metadataURI) public returns (uint256) {
        _tokenIds.increment();

        metadataURIs[_tokenIds.current()] = _metadataURI;

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);

        _ownedTokens[msg.sender].push(_metadataURI);

        _drawTokens[msg.sender].push(newTokenId);
        
        emit Mint(newTokenId, msg.sender, _metadataURI);

        return newTokenId;
    }


    // 소유한 토큰 목록 변경 함수
    function removeTokenFromList(address to, address from, string memory metadataURI) public {
        
        uint256 tokenList = _ownedTokens[from].length;

        uint256 lasTokenIdx = tokenList - 1;

        _ownedTokens[to].push(metadataURI);

        for(uint256 i = 0; i < tokenList; i ++){
            if(keccak256(bytes(metadataURI)) == keccak256(bytes(_ownedTokens[from][i]))){

                _ownedTokens[from][i] = _ownedTokens[from][lasTokenIdx];

                _ownedTokens[from].pop();

                break;
            }
        }
    }
}