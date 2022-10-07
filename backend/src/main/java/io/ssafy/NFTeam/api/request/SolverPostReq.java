package io.ssafy.NFTeam.api.request;

import io.ssafy.NFTeam.domain.entity.Solver;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SolverPostReq {

    private String walletAddress;
    private Integer tokenId;

    @Builder
    public SolverPostReq(String walletAddress, Integer tokenId){
        this.walletAddress = walletAddress;
        this.tokenId = tokenId;
    }

    public Solver toEntity(){
        return Solver.builder()
                .walletAddress(walletAddress)
                .tokenId(tokenId)
                .build();
    }
}
