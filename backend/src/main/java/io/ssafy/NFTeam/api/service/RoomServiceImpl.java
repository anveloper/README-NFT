package io.ssafy.NFTeam.api.service;

import io.ssafy.NFTeam.api.request.RoomPostReq;
import io.ssafy.NFTeam.api.response.RoomGetRes;
import io.ssafy.NFTeam.domain.entity.Room;
import io.ssafy.NFTeam.domain.repository.RoomRepository;
import io.ssafy.NFTeam.exceptions.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{

    private final RoomRepository roomRepository;

    //room 생성
    @Transactional
    public RoomGetRes createRoom(RoomPostReq requestDto){
        return new RoomGetRes(roomRepository.save(requestDto.toEntity()));
    }

    //전체 room 조회
    public List<RoomGetRes> getRooms(){
        return roomRepository.findAll().stream().map(RoomGetRes::new).collect(Collectors.toList());
    }

    //room id 조횐
    public RoomGetRes getRoomById(Long roomId){
        return new RoomGetRes(roomRepository.findById(roomId).orElseThrow(()->new RoomNotFoundException(roomId)));
    }

    //room 삭제
    @Transactional
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }
 }
