package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.LovePostReq;
import io.ssafy.NFTeam.api.response.LoveGetRes;
import io.ssafy.NFTeam.domain.entity.Love;
import io.ssafy.NFTeam.domain.repository.LoveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor //final or NonNull 옵션 필드를 전부 포함한 생성자 만들어줌
public class LoveServiceImpl implements LoveService{

    //@Autowired 사용 지양됨 -> @RequiredArgsConstructor 로 생성되는 생성자로 주입받기 위해 final 붙임
    private final LoveRepository loveRepository;

    public long addLove(LovePostReq requestDto) {

        Love love = loveRepository.findByUserIdAndNftId(requestDto.getUserId(), requestDto.getNftId()).orElse(null);

        // 현재 목록에 없는 경우, 추가
        if(love == null){
            loveRepository.save(requestDto.toEntity());
        }
        // 현재 목록에 있는 경우, 삭제
        else{
            loveRepository.deleteById(love.getID());
        }

        // 해당 nft의 좋아요 개수
        long count = loveRepository.countByNftId(requestDto.getNftId());

        return count;
    }


    public List<Love> getUserNft(String userId) {
        List<Love> nfts = loveRepository.findUserIdByUserId(userId);

        return nfts;
    }
}
