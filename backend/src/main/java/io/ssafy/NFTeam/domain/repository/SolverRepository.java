package io.ssafy.NFTeam.domain.repository;

import io.ssafy.NFTeam.domain.entity.Solver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolverRepository extends JpaRepository<Solver, Long> {
    Optional<Solver> findById(Long id);
    List<Solver> findByWalletAddress(String walletAddress);
    List<Solver> findByNftAddress(String nftAddress);
}
