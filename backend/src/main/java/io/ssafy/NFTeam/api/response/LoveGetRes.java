package io.ssafy.NFTeam.api.response;

import io.ssafy.NFTeam.domain.entity.Love;
import lombok.Getter;

import java.util.List;

@Getter
public class LoveGetRes {

    private String nftAddress;

    //repository 를 통해 조회한 entity 를 dto 로 변환 용도
    public LoveGetRes(Love entity){
        this.nftAddress = entity.getNftAddress();
    }
}
