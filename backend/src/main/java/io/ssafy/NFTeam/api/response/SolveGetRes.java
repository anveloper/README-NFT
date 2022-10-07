package io.ssafy.NFTeam.api.response;

import io.ssafy.NFTeam.domain.entity.Solver;
import lombok.Getter;

@Getter
public class SolveGetRes {
    private final Integer tokenId;

    public SolveGetRes(Solver solver) {
        this.tokenId = solver.getTokenId();
    }

}
