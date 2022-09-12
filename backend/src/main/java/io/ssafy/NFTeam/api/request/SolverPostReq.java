package io.ssafy.NFTeam.api.request;

import io.ssafy.NFTeam.domain.entity.Solver;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SolverPostReq {

    private String walletAddress;
    private String nftAddress;

    @Builder
    public SolverPostReq(String walletAddress, String nftAddress){
        this.walletAddress = walletAddress;
        this.nftAddress = nftAddress;
    }

    public Solver toEntity(){
        return Solver.builder()
                .walletAddress(walletAddress)
                .nftAddress(nftAddress)
                .build();
    }
}
