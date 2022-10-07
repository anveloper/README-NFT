package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.RoomPostReq;
import io.ssafy.NFTeam.api.response.RoomGetRes;

import java.util.List;

public interface RoomService {
    public RoomGetRes createRoom(RoomPostReq requestDto);

    //전체 room 조회
    public List<RoomGetRes> getRooms();

    //room id 조횐
    public RoomGetRes getRoomById(Long roomId);

    //room 삭제
    public void deleteRoom(Long roomId);
}
