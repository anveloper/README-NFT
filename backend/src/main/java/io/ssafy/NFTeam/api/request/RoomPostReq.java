package io.ssafy.NFTeam.api.request;

import io.ssafy.NFTeam.domain.entity.Room;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class RoomPostReq {

    private String title;
    private String createdAt;
    private String host;

    @Builder
    public RoomPostReq( String title, String createdAt, String host){
        this.title = title;
        this.createdAt = createdAt;
        this.host = host;
    }

    public Room toEntity(){
        return Room.builder()
                .title(title)
                .createdAt(createdAt)
                .host(host)
                .build();
    }
}
