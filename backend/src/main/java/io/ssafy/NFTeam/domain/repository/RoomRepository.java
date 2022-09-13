package io.ssafy.NFTeam.domain.repository;

import io.ssafy.NFTeam.domain.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
