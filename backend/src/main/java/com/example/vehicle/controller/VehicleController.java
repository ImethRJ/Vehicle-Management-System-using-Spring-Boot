package com.example.vehicle.controller;

import com.example.vehicle.model.Vehicle;
import com.example.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller layer exposing REST endpoints for Vehicles under "/api/vehicles".
 */
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @Autowired
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    /**
     * Gets all vehicles or filters them by search query parameter.
     * Endpoint: GET /api/vehicles or GET /api/vehicles?search=Toyota
     */
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles(@RequestParam(value = "search", required = false) String search) {
        List<Vehicle> vehicles;
        if (search != null && !search.trim().isEmpty()) {
            vehicles = vehicleService.searchVehicles(search);
        } else {
            vehicles = vehicleService.getAllVehicles();
        }
        return ResponseEntity.ok(vehicles);
    }

    /**
     * Gets a vehicle by ID.
     * Endpoint: GET /api/vehicles/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable("id") Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }

    /**
     * Creates a new vehicle.
     * Endpoint: POST /api/vehicles
     */
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody Vehicle vehicle) {
        Vehicle createdVehicle = vehicleService.createVehicle(vehicle);
        return new ResponseEntity<>(createdVehicle, HttpStatus.CREATED);
    }

    /**
     * Updates an existing vehicle by ID.
     * Endpoint: PUT /api/vehicles/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable("id") Long id,
            @Valid @RequestBody Vehicle vehicleDetails) {
        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDetails);
        return ResponseEntity.ok(updatedVehicle);
    }

    /**
     * Deletes a vehicle by ID.
     * Endpoint: DELETE /api/vehicles/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable("id") Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
