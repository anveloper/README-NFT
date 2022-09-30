// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";

contract MintReadmeToken is ERC721Enumerable, Ownable{

    // 내 주소 -> 소유 nft tokenId
    mapping(address => uint256[]) private ownedTokens;

    // 내 주소 -> 내가 그린 nft tokenId
    mapping(address => uint256[]) private drawTokens;

    // tokenId -> metadata
    mapping(uint256 => string) metadataURIs;

    // 전체 토큰 id 목록
    uint256[] totalReadmeToken;

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

    // get: 내 주소 -> 소유 nft tokenId
    function getOwnedTokens(address _owner) public view validAddress(_owner) returns (uint256[] memory) {
        return ownedTokens[_owner];
    }

    // get: 내 주소 -> 내가 그린 nft tokenId
    function getDrawTokens(address _owner) public view validAddress(_owner) returns (uint256[] memory) {
        return drawTokens[_owner];
    }

    // get: 내 소유 nft 개수 조회
    function getMyReadmeTokenArrayLength(address _owner) public view validAddress(_owner) returns (uint256) {
        return ownedTokens[_owner].length;
    }

    // get: 내가 그린 nft 개수 조회
    function getDrawReadmeTokenArrayLength(address _owner) public view validAddress(_owner) returns (uint256) {
        return drawTokens[_owner].length;
    }

    // get: 발행된 전체 토큰 목록
    function getTotalReadmeToken() public view returns(uint256[] memory){
        return totalReadmeToken;
    }


    // NFT 발행
    function create(string memory _metadataURI, address saleReadmeToken) public returns (uint256) {
        uint256 newTokenId = totalSupply() + 1; // 새로운 tokenId 생성

        metadataURIs[newTokenId] = _metadataURI; // 메타 데이터 추가

        _mint(msg.sender, newTokenId); // 민팅

        ownedTokens[msg.sender].push(newTokenId); // 소유 목록 추가 

        // drawTokens[msg.sender].push(newTokenId); // 그린 목록 추가(그린 사람 = 민팅)
        
        totalReadmeToken.push(newTokenId); // 전체 토큰 목록에 추가

        _approve(saleReadmeToken, newTokenId); // 판매 컨트랙트에 권한 부여 

        // _approve(bidReadmeToken, newTokenId); // 경매 컨트랙트에 권한 부여

        emit Mint(newTokenId, msg.sender, _metadataURI); // 생성 확인 로그(새로운 tokenId, 생성자, 메타데이터)

        return newTokenId;
    }


    // nft 판매 시, 소유한 토큰 목록 변경
    function removeTokenFromList(address _to, address _from, uint256 _tokenId) validAddress(_to) public {
        uint256 tokenList = ownedTokens[_from].length; // 현재 소유토큰 개수 확인

        uint256 lasTokenIdx = tokenList - 1; // 마지막 인덱스 값

        ownedTokens[_to].push(_tokenId); // 구매자의 nft 목록 추가
        
        for(uint256 i = 0; i < tokenList; i ++){

            if(ownedTokens[_from][i] == _tokenId){
                
                ownedTokens[_from][i] = ownedTokens[_from][lasTokenIdx]; // 마지막 인덱스 nft를 중간으로 이동
                
                ownedTokens[_from].pop(); // 제거
                
                break;
            }
        }
    }

    // 입력한 주소 유효성 검사
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid Address");
        _;
    }
}