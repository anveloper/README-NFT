package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.LovePostReq;
import io.ssafy.NFTeam.api.response.LoveGetRes;
import io.ssafy.NFTeam.domain.entity.Love;

import java.util.List;

public interface LoveService {
    // 등록
    public long addLove(LovePostReq requestDto);
    public List<LoveGetRes> getUserNft(String walletAddress);

}
