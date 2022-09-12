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

    @Column(name = "wallet_address")
    private String walletAddress;

    @Column(name = "nft_address")
    private String nftAddress;

}