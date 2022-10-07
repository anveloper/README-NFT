package io.ssafy.NFTeam.domain.repository;

import io.ssafy.NFTeam.api.request.RoomPostReq;
import io.ssafy.NFTeam.api.response.RoomGetRes;
import io.ssafy.NFTeam.api.service.RoomServiceImpl;
import io.ssafy.NFTeam.domain.entity.Room;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;


@RunWith(SpringRunner.class)
@SpringBootTest
public class RoomRepositoryTest {
    @Autowired
    private RoomServiceImpl roomServiceImpl;

    @Test
    @Transactional
    public void testRoom() throws Exception{
        //given
        RoomPostReq roomPostReq = new RoomPostReq();
        roomPostReq.setHost("kww");
        roomPostReq.setCreatedAt("2022-09-10");
        roomPostReq.setTitle("testRoom");

        //when
        Long createdRoomId = roomServiceImpl.createRoom(roomPostReq).getRoomId();
        RoomGetRes findRoom = roomServiceImpl.getRoomById(createdRoomId);

        //then
        Assertions.assertThat(createdRoomId).isEqualTo(findRoom.getRoomId());
    }
}