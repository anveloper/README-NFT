package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.LovePostReq;
import io.ssafy.NFTeam.api.response.LoveGetRes;
import io.ssafy.NFTeam.api.service.LoveService;
import io.ssafy.NFTeam.domain.entity.Love;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(value = "좋아요 API", tags = {"Love"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LoveController {

    private final LoveService loveService;

    HttpStatus status;
    HashMap<String, Object> result;

    @PutMapping("/like")
    @ApiOperation(value = "좋아요 등록 및 해제", notes = "사용자 아이디와 nft 아이디를 통해 좋아요를 등록 및 해제한다.")
    @ApiResponses({
            @ApiResponse(code = 201, message = "좋아요 요청 성공"),
            @ApiResponse(code = 400, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> LoveAdd(@RequestBody LovePostReq requestDto){
        result = new HashMap<>();

        long count = loveService.addLove(requestDto);

        try{
            result.put("msg", "좋아요 요청에 성공하였습니다");
            result.put("count", count);
            status = HttpStatus.CREATED;

        } catch (Exception e){
            result.put("error", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(result, status);

    }

    @GetMapping("/like/{walletAddress}")
    @ApiOperation(value = "좋아요를 등록한 nft 조회", notes = "특정 사용자가 좋아요한 nft 목록을 응답한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "좋아요한 nft 목록 조회 성공"),
            @ApiResponse(code = 400, message = "입력값 오류"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> LoveList(@PathVariable String walletAddress){
        result = new HashMap<>();

        List<Integer> nfts = loveService.getUserNft(walletAddress);
        long count = nfts.stream().count();

        try{
            result.put("msg", "좋아요 조회에 성공하였습니다");
            result.put("count", count);
            result.put("nfts", nfts);

            status = HttpStatus.OK;

        } catch (Exception e){
            result.put("error", e.getMessage());

            status = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(result, status);
    }

}
