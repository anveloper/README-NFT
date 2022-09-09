package io.ssafy.NFTeam.domain.entity;

//public class Solver {
//
//    private String ID;
//
//    private Integer NFT_id;
//}

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Solver {

    @Id
    @GeneratedValue
    private Long ID;

    @Column(nullable = false)
    private String loginId;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;


}