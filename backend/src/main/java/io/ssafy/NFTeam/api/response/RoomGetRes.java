package io.ssafy.NFTeam.api.response;

import io.ssafy.NFTeam.domain.entity.Room;
import lombok.Getter;

@Getter
public class RoomGetRes {

    private final Long roomId;
    private final String title;
    private final String createdAt;
    private final String host;

    public RoomGetRes(Room room){
        this.roomId = room.getRoomId();
        this.title = room.getTitle();
        this.createdAt = room.getCreatedAt();
        this.host = room.getHost();
    }
}
