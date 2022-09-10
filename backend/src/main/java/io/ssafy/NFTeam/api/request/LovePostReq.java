package io.ssafy.NFTeam.api.request;

import io.ssafy.NFTeam.domain.entity.Love;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LovePostReq {

    private String userId;
    private String nftId;

    @Builder
    public LovePostReq(String userId, String nftId){
        this.userId = userId;
        this.nftId = nftId;
    }

    //resquest dto 로 받은 Posts 객체를 entity 화하여 저장하는 용도
    public Love toEntity(){
        return Love.builder()
                .userId(userId)
                .nftId(nftId)
                .build();
    }


}
