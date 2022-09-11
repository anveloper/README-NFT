package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.SolverRequestDto;
import io.ssafy.NFTeam.api.response.SolverResponseDto;
import io.ssafy.NFTeam.api.service.SolverService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/solver")
@RequiredArgsConstructor
public class SolverController {

    private final SolverService solverService;

    @PostMapping()
    public ResponseEntity<HashMap<String, Boolean>> solveNft(@RequestBody SolverRequestDto request) {
        boolean solveRet = solverService.solve(request);
        HashMap<String, Boolean> jsonMap = new HashMap<>();

        if (solveRet) {
            jsonMap.put("message", true);
        } else {
            jsonMap.put("message", false);
        }
        return ResponseEntity.ok(jsonMap);
    }

    @GetMapping()
    public ResponseEntity<HashMap<String, Boolean>> checkSolve(@RequestBody SolverRequestDto request) {
        boolean isSolvedNft = solverService.isSolved(request);
        HashMap<String, Boolean> jsonMap = new HashMap<>();
        if (isSolvedNft) {
            jsonMap.put("message", true);
        } else {
            jsonMap.put("message", false);
        }
        return ResponseEntity.ok(jsonMap);
    }

}
