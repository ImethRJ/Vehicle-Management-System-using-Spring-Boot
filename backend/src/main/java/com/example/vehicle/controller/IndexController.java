package com.example.vehicle.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller exposing the API root welcome landing payload.
 */
@RestController
public class IndexController {

    /**
     * Responds to GET / with an API platform index message and routes list.
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getApiIndex() {
        Map<String, Object> response = new HashMap<>();
        response.put("name", "Vehicle Management API Platform");
        response.put("version", "1.0.0-SNAPSHOT");
        response.put("status", "UP");
        response.put("endpoints", "/api/vehicles");
        response.put("h2-console", "/h2-console");
        return ResponseEntity.ok(response);
    }
}
