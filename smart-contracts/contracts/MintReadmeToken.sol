// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./BatchMint.sol";

contract MintReadmeToken is ERC721Enumerable, Ownable{

    // 내 주소 -> 소유 nft tokenId
    mapping(address => uint256[]) private ownedTokens;

    // 내 주소 -> 내가 그린 nft tokenId
    mapping(address => uint256[]) private drawTokens;

    // tokenId -> metadata
    mapping(uint256 => string) metadataURIs;

    // tokenId -> 정답
    mapping(uint256 => string) answer;

    // tokenId -> 최초 정답자
    mapping(uint256 => address) solver;

    // 내가 맞춘 문제 리스트
    mapping(address => uint256[]) question;

    // 전체 토큰 id 목록
    uint256[] totalReadmeToken;

    BatchMint public batchMint;

    constructor(address _batchMint) ERC721("ReadmeNFT", "RMN") {
        batchMint = BatchMint(_batchMint);
    }

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

    // get: 정답 조회
    function getTokenAnswer(uint256 _tokenId) public view returns (string memory) {
        return answer[_tokenId];
    }

    // get: 최초 정답자 조회
    function getTokenSolver(uint256 _tokenId) public view returns (address){
        return solver[_tokenId]; // 만약 return이 address(0)이면 최초 정답자가 없는 것
    }

    // get: 내가 맞춘 문제 리스트
    function getSolveReadmeTokenArray(address _owner) public view returns(uint256[] memory){
        return question[_owner];
    }

    // 이벤트 컨트랙트 발행(1~50번 먼저 발행해야함)
    function batchNFT(address _drawToken) public {
        address own = msg.sender;

        for(uint i = 0; i < 50;){
        
        uint256 newTokenId = SafeMath.add(totalSupply(), 1);
        
        _mint(own, newTokenId); // 민팅

        _approve(_drawToken, newTokenId); // 권한 부여
        
        metadataURIs[newTokenId] = batchMint.tokenURI(newTokenId);
        
        unchecked{
            ++i;
            }
        }   
    }


    // NFT 발행
    function create(string memory _metadataURI, address _saleReadmeToken, address _bidReadmeToken, string memory _answer, address _solver) public returns (uint256) {
        
        address own = msg.sender;

        uint256 newTokenId = SafeMath.add(totalSupply(), 1); // 새로운 tokenId 생성

        metadataURIs[newTokenId] = _metadataURI; // 메타 데이터 추가

        _mint(own, newTokenId); // 민팅

        ownedTokens[own].push(newTokenId); // 소유 목록 추가 

        drawTokens[own].push(newTokenId); // 그린 목록 추가(그린 사람 = 민팅)
        
        totalReadmeToken.push(newTokenId); // 전체 토큰 목록에 추가

        answer[newTokenId] = _answer; // 정답 추가

        // 최초 정답자 추가: 없을 경우, 본인 address가 들어감
        if(own == _solver){
            solver[newTokenId] = address(0); 
        }
        else{
            solver[newTokenId] = _solver; 
        }

        _approve(_saleReadmeToken, newTokenId); // 판매 컨트랙트에 권한 부여 

        _approve(_bidReadmeToken, newTokenId); // 경매 컨트랙트에 권한 부여

        return newTokenId;
    }


    // 내가 문제별 정답자 추가
    // 매개변수: 문제 번호와 정답, 제출한 답
    function solveReadmeToken(uint256 _questionId, string memory _solve, string memory _answer) public {
        // 호출자: 문제 풀이를 시도한 시림
        address candidate = msg.sender;
        // 만약 정답일 경우, 목록에 추가
        if(keccak256(bytes(_solve)) == keccak256(bytes(_answer))){

            question[candidate].push(_questionId);
        }

    }

    // nft 판매 시, 소유한 토큰 목록 변경
    function removeTokenFromList(address _to, address _from, uint256 _tokenId) validAddress(_to) public {
        
        uint256[] memory _ownedTokens = ownedTokens[_from]; // 판매자의 토큰 목록 확인

        uint256 tokenList = _ownedTokens.length; // 현재 소유토큰 개수 확인

        uint256 lasTokenIdx = SafeMath.sub(tokenList, 1); // 마지막 인덱스 값

        ownedTokens[_to].push(_tokenId); // 구매자의 nft 목록 추가
        
        for(uint256 i = 0; i < tokenList;){

            if(ownedTokens[_from][i] == _tokenId){
                
                ownedTokens[_from][i] = ownedTokens[_from][lasTokenIdx]; // 마지막 인덱스 nft를 중간으로 이동
                
                ownedTokens[_from].pop(); // 제거
                
                break;
            }
            
            unchecked{
                ++i;
            }
        }
    }

    // 입력한 주소 유효성 검사
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid Address");
        _;
    }
}