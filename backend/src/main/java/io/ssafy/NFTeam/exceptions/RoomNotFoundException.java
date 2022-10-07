package io.ssafy.NFTeam.exceptions;

public class RoomNotFoundException extends RuntimeException{
    public RoomNotFoundException(Long id) {
        super("could not found room" + id);
    }
}
