package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.SolverPostReq;

public interface SolverService {
    public boolean isSolved(String walletAddress, String nftAddress);

    public boolean solve(SolverPostReq solverRequestDto);
}
