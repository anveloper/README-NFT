package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.SolverRequestDto;
import io.ssafy.NFTeam.api.response.SolverResponseDto;
import io.ssafy.NFTeam.api.service.SolverService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Api(value = "풀이 API", tags = {"Solver"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SolverController {

    private final SolverService solverService;

    @PostMapping("/solver")
    @ApiOperation(value = "문제를 푼다", notes = "사용자 아이디와 nft 아이디를 통해 사용자의 푼 nft 리스트에 등록한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 404, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
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

    @GetMapping("/solver/{userId}/{nftId}")
    @ApiOperation(value = "푼 문제를 조회한다", notes = "사용자 아이디와 nft 아이디를 통해 사용자가 푼 문제인지 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "권한 없음"),
            @ApiResponse(code = 404, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<HashMap<String, Boolean>> checkSolve(@PathVariable("userId") String userId, @PathVariable("nftId") String nftId) {
        boolean isSolvedNft = solverService.isSolved(userId, nftId);
        HashMap<String, Boolean> jsonMap = new HashMap<>();
        if (isSolvedNft) {
            jsonMap.put("message", true);
        } else {
            jsonMap.put("message", false);
        }
        return ResponseEntity.ok(jsonMap);
    }
}
