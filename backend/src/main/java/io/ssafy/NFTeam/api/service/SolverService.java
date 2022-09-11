package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.SolverRequestDto;
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
    public boolean isSolved(String userId, String nftId) {
        try {
            List<Solver> nftList = solverRepository.findByNftId(nftId);
            for (Solver nft: nftList) {
                String nftSolver = nft.getUserId();
                if(nftSolver.equals(userId)) {
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // 문제를 풂(유저의 nft 리스트에 추가)
    public boolean solve(SolverRequestDto solverRequestDto) {

        try {
            List<Solver> nftList = solverRepository.findByUserId(solverRequestDto.getUserId());
            
            // 배열을 순회에서 푼 문제에 있으면 false처리
            for (Solver nft: nftList) {
                String solvedNft = nft.getNftId();
                String checkNft = solverRequestDto.getNftId();
                if(solvedNft.equals(checkNft)) {
                    return false;
                }
            }

            Solver newSolver = Solver.builder()
                    .nftId(solverRequestDto.getNftId())
                    .userId(solverRequestDto.getUserId())
                    .build();

//            nftList.add(newSolver);
            solverRepository.save(newSolver);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
