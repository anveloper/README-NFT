package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.domain.entity.Room;
import io.ssafy.NFTeam.domain.repository.RoomRepository;
import io.ssafy.NFTeam.exceptions.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomController {
    private final RoomRepository roomRepository;

    @GetMapping("/room")
    List<Room> all() {
        return roomRepository.findAll();
    }

    @GetMapping("/room/{id}")
    Room one(@PathVariable Long id){
        return roomRepository.findById(id).orElseThrow(() -> new RoomNotFoundException(id));
    }

    @PostMapping("/room")
    Room newRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    @DeleteMapping("/room/{id}")
    void deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
    }

}
