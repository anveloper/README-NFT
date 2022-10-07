package io.ssafy.NFTeam.domain.repository;

import io.ssafy.NFTeam.domain.entity.Solver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolverRepository extends JpaRepository<Solver, Long> {
    List<Solver> findByWalletAddress(String walletAddress);
    List<Solver> findByTokenId(Integer tokenId);
}
