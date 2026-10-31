package com.campus.ccms;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.util.TimeZone;

@SpringBootApplication
@EnableTransactionManagement
public class CcmsApplication {

    @PostConstruct
    public void init() {
        // Enforce Indian Standard Time (IST, UTC+05:30) for the JVM
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
    }

    public static void main(String[] args) {
        SpringApplication.run(CcmsApplication.class, args);
    }
}
