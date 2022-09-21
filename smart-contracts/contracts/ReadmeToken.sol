// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


contract ReadmeToken is ERC721Enumerable, Ownable{

    // 내 주소 -> 소유 nft metadata
    mapping(address => string[]) private ownedTokens;

    // 내 주소 -> 내가 그린 nft metadata
    mapping(address => uint256[]) private drawTokens;

    // tokenId -> metadata
    mapping(uint256 => string) metadataURIs;


    // 생성된 토큰 확인
    event Mint(
        uint256 indexed tokenId,
        address indexed owner,
        string indexed metadataURI
    );

    constructor() ERC721("ReadmeNFT", "RMN") {}

    // get: 현재 발행된 nft 개수
    function getCurrentNft() public view returns (uint256) {
        return totalSupply();
    }

    // get: tokenId -> metadata
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(metadataURIs[_tokenId]));
    }

    // get: 내 주소 -> 내가 그린 nft metadata
    function getOwnedTokens(address _owner) public view returns (string[] memory) {
        require (_owner != address(0), "Not your nft");
        return ownedTokens[_owner];
    }

    // get: 내 주소 -> 소유 nft metadata
    function getDrawTokens(address _owner) public view returns (uint256[] memory) {
        require (_owner != address(0), "Not your draw");
        return drawTokens[_owner];
    }

    // NFT 발행
    function create(string memory _metadataURI) public returns (uint256) {
        uint256 newTokenId = totalSupply() + 1; // 새로운 tokenId 생성

        metadataURIs[newTokenId] = _metadataURI; // 메타 데이터 추가

        _mint(msg.sender, newTokenId); // 민팅

        ownedTokens[msg.sender].push(_metadataURI); // 소유 목록 추가 

        drawTokens[msg.sender].push(newTokenId); // 그린 목록 추가(그린 사람 = 민팅)
        
        emit Mint(newTokenId, msg.sender, _metadataURI); // 생성 확인 로그(새로운 tokenId, 생성자, 메타데이터)

        return newTokenId;
    }


    // nft 판매 시, 소유한 토큰 목록 변경
    function removeTokenFromList(address to, address from, uint256 tokenId) public {
        uint256 tokenList = ownedTokens[from].length; // 현재 소유토큰 개수 확인

        uint256 lasTokenIdx = tokenList - 1; // 마지막 인덱스 값
        
        string memory meta = metadataURIs[tokenId]; // 판매한 nft의 metadata 확인

        ownedTokens[to].push(meta); // 구매자의 nft 목록 추가
        
        for(uint256 i = 0; i < tokenList; i ++){

            if(keccak256(bytes(meta)) == keccak256(bytes(ownedTokens[from][i]))){
                
                ownedTokens[from][i] = ownedTokens[from][lasTokenIdx]; // 마지막 인덱스 nft를 중간으로 이동
                
                ownedTokens[from].pop(); // 제거
                
                break;
            }
        }
    }
}