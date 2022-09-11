package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.domain.entity.Room;
import io.ssafy.NFTeam.domain.repository.RoomRepository;
import io.ssafy.NFTeam.exceptions.RoomNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(value = "Room Api", tags = {"Room"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RoomController {
    private final RoomRepository roomRepository;

    @GetMapping("/room")
    @ApiOperation(value = "Room 전체 조회", notes = "Room 전체 조회")
    ResponseEntity<Map<String, Object>> getAllRoom() {
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;
        try {
            List<Room> rooms =  roomRepository.findAll();
            result.put("msg", "Room 정보 조회에 성공하였습니다.");
            result.put("rooms", rooms);
            status = HttpStatus.OK;
        } catch (Exception e) {
            result.put("msg", "Room 리스트 조회에 실패 하였습니다.");
            result.put("err", e);
            status= HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(result, status);
    }

    @GetMapping("/room/{id}")
    @ApiOperation(value = "Room 조회", notes = "Id를 통한 Room 조회")
    ResponseEntity<Map<String, Object>> getRoomById(@PathVariable Long id){
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;
        try {
            Room room = roomRepository.findById(id).orElseThrow(()->new RoomNotFoundException(id));
            result.put("msg", "Room 정보 조회에 성공하였습니다.");
            result.put("room", room);
            status = HttpStatus.OK;
        } catch (Exception e) {
            result.put("msg", "Room 정보 조회에 실패 하였습니다.");
            result.put("err", e);
            status= HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(result, status);
    }

    @PostMapping("/room")
    @ApiOperation(value = "Room 생성", notes = "Room 생성 후 생성된 Room 반환")
    ResponseEntity<Map<String, Object>> createRoom(@RequestBody Room room) {
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;
        try {
            Room createdRoom = roomRepository.save(room);
            result.put("msg", "Room 생성에 성공하였습니다.");
            result.put("room", createdRoom);
            status = HttpStatus.CREATED;
        } catch (Exception e) {
            result.put("msg", "Room 생성에 실패 하였습니다.");
            result.put("err", e);
            status= HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(result, status);
    }

    @DeleteMapping("/room/{id}")
    @ApiOperation(value = "Room 삭제", notes = "Id를 통한 Room 삭제")
    ResponseEntity<Map<String, Object>> deleteRoom(@PathVariable Long id) {
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;
        try {
            roomRepository.deleteById(id);
            result.put("msg", "Room 삭제에 성공하였습니다.");
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {
            result.put("msg", "Room 삭제에 실패 하였습니다.");
            result.put("err", e);
            status= HttpStatus.BAD_REQUEST;
        }
        return new ResponseEntity<>(result, status);
    }

}
