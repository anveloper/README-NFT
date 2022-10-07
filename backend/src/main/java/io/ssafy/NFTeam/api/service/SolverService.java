package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.SolverPostReq;
import io.ssafy.NFTeam.api.response.SolveGetRes;
import io.ssafy.NFTeam.domain.entity.Solver;

import java.util.List;

public interface SolverService {
    public boolean isSolved(String walletAddress, Integer tokenId);

    public boolean solve(SolverPostReq solverRequestDto);

    public List<Integer> getSolveList(String walletAddress);
}
