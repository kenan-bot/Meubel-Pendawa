package com.meubelpendawa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.meubelpendawa.dto.LoginLogResponse;
import com.meubelpendawa.model.LoginLog;
import com.meubelpendawa.service.LoginLogService;

@RestController
@RequestMapping("/login-log")
@CrossOrigin("*")
public class LoginLogController {

    @Autowired
    private LoginLogService loginLogService;

    @GetMapping
    public List<LoginLogResponse> getAllLog() {
        return loginLogService.getAllLog();
    }

    @GetMapping("/karyawan/{idKaryawan}")
    public List<LoginLogResponse> getLogByKaryawan(
            @PathVariable String idKaryawan) {

        return loginLogService.getLogByKaryawan(idKaryawan);
    }
}