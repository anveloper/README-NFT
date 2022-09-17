// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./token/ERC721/ERC721.sol";
import "./access/Ownable.sol";

/**
 * PJT Ⅰ - 과제 2) NFT Creator 구현
 * 상태 변수나 함수의 시그니처는 구현에 따라 변경할 수 있습니다.
 */
contract NFTCreater is ERC721, Ownable{
    // using Counters for Counters.Counter;
    // Counters.Counter private _tokenIds;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // 내 소유 nft 리스트
    mapping(address => uint256[]) private _ownedTokens;

    // 내가 그린 nft 리스트
    mapping(address => uint256[]) private _drawTokens;


    // 생성된 tokenId, 생성자(소유자)
    event NewNFT(
        uint256 indexed _tokenId,
        address _owner,
        uint256[] indexed ownedNft,
        uint256[] indexed drawNft
        );

    // metadataURI 저장 mapping
    mapping(uint256 => string) metadataURIs;

    constructor() ERC721("ReadMeNFT", "RMN") {}

    function current() public view returns (uint256) {
        return Counters.current(_tokenIds);
    }

    // metadataURI 출력
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return metadataURIs[tokenId];
    }

    // 소유한 NFT 조회
    function ownedTokens(address owner) public view virtual returns (uint256[] memory) {
        require (owner != address(0), "Not your nft");
        return _ownedTokens[owner];
    }

    // 내가 그린 NFT 조회
    function drawTokens(address owner) public view virtual returns (uint256[] memory) {
        require (owner != address(0), "Not your draw");
        return _drawTokens[owner];

    }

    // 소유한 토큰 목록 변경 함수
    function _removeTokenFromList(address to, address from, uint256 tokenId) private {
        
        uint256 tokenList = _ownedTokens[from].length;

        uint256 lasTokenIdx = tokenList - 1;

        // 받은 사람 토큰 목록에 추가
        _ownedTokens[to].push(tokenId);

        // 전송한 사람 토큰 목록에서 제거
        for(uint256 i = 0; i < tokenList; i ++){
            if(tokenId == _ownedTokens[from][i]){
                // 마지막 자리에 있는 tokenId를 전송한 토큰의 자리로 옮김
                _ownedTokens[from][i] = _ownedTokens[from][lasTokenIdx];
                // 마지막 토큰 삭제
                _ownedTokens[from].pop();
                break;
            }
        }

    }


    // NFT 발행
    function create(address to, string memory _tokenURI) public returns (uint256) {

        _tokenIds.increment();
        metadataURIs[_tokenIds.current()] = _tokenURI;
        uint256 newNFTId = _tokenIds.current();
        // 발행
        _mint(to, newNFTId);

        // 소유 NFT 목록에 추가
        _ownedTokens[to].push(newNFTId);

        // 그린사람 = 발행자므로 그린 NFT 목록에도 추가
        _drawTokens[to].push(newNFTId);
        
        // 이벤트 발생
        emit NewNFT(newNFTId, to, _ownedTokens[to], _drawTokens[to]);

        return newNFTId;



    }

    
}