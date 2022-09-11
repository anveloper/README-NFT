package io.ssafy.NFTeam.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Solver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long solverId;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "nft_id")
    private String nftId;

}