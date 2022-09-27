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

    private String walletAddress;
    private Integer tokenId;

    @Builder
    public LovePostReq(Integer tokenId, String walletAddress){
        this.walletAddress = walletAddress;
        this.tokenId = tokenId;
    }

    //resquest dto 로 받은 Posts 객체를 entity 화하여 저장하는 용도
    public Love toEntity(){
        return Love.builder()
                .walletAddress(walletAddress)
                .tokenId(tokenId)
                .build();
    }
}
