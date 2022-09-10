package io.ssafy.NFTeam.domain.repository;

import io.ssafy.NFTeam.api.response.LoveGetRes;
import io.ssafy.NFTeam.domain.entity.Love;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoveRepository extends JpaRepository<Love, Long> {
    public Optional<Love> findByUserIdAndNftId(String userId, String nftId);
    public long countByNftId(String nftId);
    public List<Love> findUserIdByUserId(String userId);

}
