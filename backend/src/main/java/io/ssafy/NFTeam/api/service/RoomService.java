//package io.ssafy.NFTeam.api.service;
//
//import io.ssafy.NFTeam.domain.entity.Room;
//import io.ssafy.NFTeam.domain.repository.RoomRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@Transactional(readOnly = true)
//@RequiredArgsConstructor
//public class RoomService {
//
//    private final RoomRepository roomRepository;
//
//    //room 생성
//    @Transactional
//    public Room createRoom(Room room){
//        return roomRepository.createRoom(room);
//    }
//
//    //전체 room 조회
//    public List<Room> getRooms(){
//        return roomRepository.findAll();
//    }
//
//    //room id 조횐
//    public Room getRoomById(Long roomId){
//        return roomRepository.findRoom(roomId);
//    }
//
//    //room 삭제
//    @Transactional
//    public void deleteRoom(Long roomId) {
//        roomRepository.deleteRoom(roomId);
//    }
// }
