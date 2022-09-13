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
    private String nftAddress;

    @Builder
    public LovePostReq(String nftAddress, String walletAddress){
        this.walletAddress = walletAddress;
        this.nftAddress = nftAddress;
    }

    //resquest dto 로 받은 Posts 객체를 entity 화하여 저장하는 용도
    public Love toEntity(){
        return Love.builder()
                .walletAddress(walletAddress)
                .nftAddress(nftAddress)
                .build();
    }


}
