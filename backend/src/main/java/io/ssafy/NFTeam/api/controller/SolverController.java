package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.SolverPostReq;
import io.ssafy.NFTeam.api.service.SolverService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Api(value = "문제 풀이 API", tags = {"Solver"})
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SolverController {

    private final SolverService solverService;

    @PostMapping("/solver")
    @ApiOperation(value = "문제를 푼다", notes = "사용자 아이디와 nft 아이디를 통해 사용자의 푼 nft 리스트에 등록한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 201, message = "풀이 성공"),
            @ApiResponse(code = 400, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<HashMap<String, Object>> solveNft(@RequestBody SolverPostReq request) {
        HttpStatus status;
        HashMap<String, Object> jsonMap = new HashMap<>();

        try {
            boolean solveRet = solverService.solve(request);
            if (solveRet) {
                jsonMap.put("msg", "문제 풀이에 성공하였습니다.");
                status = HttpStatus.CREATED;
            } else {
                jsonMap.put("msg", "이미 푼 문제입니다.");
                status = HttpStatus.OK;
            }
            jsonMap.put("isSolved", solveRet);

        } catch (Exception e){
            jsonMap.put("msg", "잘못된 요청입니다.");
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(jsonMap, status);
    }

    @GetMapping("/solver/{walletAddress}/{nftAddress}")
    @ApiOperation(value = "푼 문제를 조회한다", notes = "사용자 아이디와 nft 아이디를 통해 사용자가 푼 문제인지 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 400, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<HashMap<String, Object>> checkSolve(@PathVariable("walletAddress") String walletAddress, @PathVariable("nftAddress") String nftAddress) {
        HashMap<String, Object> jsonMap = new HashMap<>();
        HttpStatus status;

        try {
            boolean isSolvedNft = solverService.isSolved(walletAddress, nftAddress);
            jsonMap.put("msg", "정답 여부 조회에 성공하였습니다.");
            jsonMap.put("isSolved", isSolvedNft);
            status = HttpStatus.OK;

        } catch (Exception e){
            jsonMap.put("msg", "정답 여부 조회 요청에 실패하였습니다.");
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(jsonMap, status);
    }
}
