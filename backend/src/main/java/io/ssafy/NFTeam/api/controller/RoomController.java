package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.RoomPostReq;
import io.ssafy.NFTeam.api.response.RoomGetRes;
import io.ssafy.NFTeam.api.service.RoomServiceImpl;
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
    private final RoomServiceImpl roomServiceImpl;
    HttpStatus status;
    HashMap<String, Object> result;
    @GetMapping("/room")
    @ApiOperation(value = "Room 전체 조회", notes = "Room 전체 조회")
    ResponseEntity<Map<String, Object>> getAllRoom() {
        result = new HashMap<>();
        try {
            List<RoomGetRes> rooms =  roomServiceImpl.getRooms();
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
        result = new HashMap<>();
        try {
            RoomGetRes room = roomServiceImpl.getRoomById(id);
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
    ResponseEntity<Map<String, Object>> createRoom(@RequestBody RoomPostReq requestDto) {
        result = new HashMap<>();
        try {
            RoomGetRes createdRoom = roomServiceImpl.createRoom(requestDto);
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
        result = new HashMap<>();
        try {
            roomServiceImpl.deleteRoom(id);
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
