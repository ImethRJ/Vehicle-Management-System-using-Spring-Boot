package com.example.vehicle.service;

import com.example.vehicle.model.Vehicle;
import java.util.List;

/**
 * Service interface for managing vehicles.
 */
public interface VehicleService {
    
    /**
     * Retrieves all vehicles.
     */
    List<Vehicle> getAllVehicles();

    /**
     * Searches vehicles by a search query (make, model, color, status, vin).
     */
    List<Vehicle> searchVehicles(String query);

    /**
     * Retrieves a vehicle by its ID.
     */
    Vehicle getVehicleById(Long id);

    /**
     * Creates a new vehicle.
     */
    Vehicle createVehicle(Vehicle vehicle);

    /**
     * Updates an existing vehicle.
     */
    Vehicle updateVehicle(Long id, Vehicle vehicleDetails);

    /**
     * Deletes a vehicle by its ID.
     */
    void deleteVehicle(Long id);
}
