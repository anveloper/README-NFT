package io.ssafy.NFTeam.api.controller;

import io.ssafy.NFTeam.api.request.LovePostReq;
import io.ssafy.NFTeam.api.service.LoveService;
import io.ssafy.NFTeam.domain.entity.Love;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
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

    private static final String SUCCESS = "success";
    private static final String FAIL = "fail";
    private static final String ERROR = "error";

    private final LoveService loveService;

    @PostMapping("/like")
    @ApiOperation(value = "좋아요 등록 및 해제", notes = "사용자 아이디와 nft 아이디를 통해 좋아요를 등록 및 해제한다.")
    public ResponseEntity<Map<String, Object>> LoveAdd(@RequestBody LovePostReq requestDto){
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;

        long count = loveService.addLove(requestDto);

        try{
            result.put("msg", SUCCESS);
            result.put("count", count);
            status = HttpStatus.ACCEPTED;

        } catch (Exception e){
            result.put("error", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(result, status);

    }

    @GetMapping("/like/{userId}")
    @ApiOperation(value = "좋아요를 등록한 nft 조회", notes = "특정 사용자가 좋아요한 nft 목록을 응답한다.")
    public ResponseEntity<Map<String, Object>> LoveList(@PathVariable String userId){
        HashMap<String, Object> result = new HashMap<>();
        HttpStatus status;

        List<Love> nfts = loveService.getUserNft(userId);
        long count = nfts.stream().count();

        try{
            result.put("msg", SUCCESS);
            result.put("count", count);
            result.put("nfts", nfts);

            status = HttpStatus.OK;

        } catch (Exception e){
            result.put("error", e.getMessage());

            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<>(result, status);
    }

}
