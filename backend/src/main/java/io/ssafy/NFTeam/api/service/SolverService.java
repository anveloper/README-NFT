package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.SolverPostReq;
import io.ssafy.NFTeam.domain.entity.Solver;
import io.ssafy.NFTeam.domain.repository.SolverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SolverService {

    private final SolverRepository solverRepository;

    // 문제를 풀었는지 확인
    public boolean isSolved(String walletAddress, String nftAddress) {

        List<Solver> nftList = solverRepository.findByNftAddress(nftAddress);
        
        // 배열을 순회해서 문제를 풀었으면 true를 반환
        for (Solver nft: nftList) {
            String nftSolver = nft.getWalletAddress();
            if(nftSolver.equals(walletAddress)) {
                return true;
            }
        }
        return false;
    }

    // 문제를 풂(유저의 nft 리스트에 추가)
    public boolean solve(SolverPostReq solverRequestDto) {

        List<Solver> nftList = solverRepository.findByWalletAddress(solverRequestDto.getWalletAddress());
        
        // 배열을 순회에서 푼 문제에 있으면 false처리
        for (Solver nft: nftList) {
            String solvedNft = nft.getNftAddress();
            String checkNft = solverRequestDto.getNftAddress();
            if(solvedNft.equals(checkNft)) {
                return false;
            }
        }

        Solver newSolver = solverRequestDto.toEntity();
//            Solver newSolver = Solver.builder()
//                    .nftId(solverRequestDto.getNftId())
//                    .userId(solverRequestDto.getUserId())
//                    .build();

//            nftList.add(newSolver);
        solverRepository.save(newSolver);
        return true;
    }

}
