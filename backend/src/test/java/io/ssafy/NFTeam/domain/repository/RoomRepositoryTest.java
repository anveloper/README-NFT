package io.ssafy.NFTeam.domain.repository;

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
    private RoomRepository roomRepository;

    @Test
    @Transactional
    public void testRoom() throws Exception{
        //given
        Room room = new Room();
        room.setHost("kww");
        room.setCreatedAt("2022-09-10");
        room.setTitle("testRoom");

        //when
        Long createdRoomId = roomRepository.createRoom(room).getRoomId();
        Room findRoom = roomRepository.findRoom(createdRoomId);

        //then
        Assertions.assertThat(createdRoomId).isEqualTo(findRoom.getRoomId());
    }
}