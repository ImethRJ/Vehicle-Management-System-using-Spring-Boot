package com.example.vehicle.service;

import com.example.vehicle.exception.ResourceNotFoundException;
import com.example.vehicle.model.Vehicle;
import com.example.vehicle.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for managing vehicles.
 */
@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vehicle> searchVehicles(String query) {
        if (query == null || query.trim().isEmpty()) {
            return vehicleRepository.findAll();
        }
        return vehicleRepository.searchVehicles(query.trim());
    }

    @Override
    @Transactional(readOnly = true)
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    @Override
    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        // Enforce business rule: VIN must be unique
        if (vehicleRepository.existsByVin(vehicle.getVin())) {
            throw new IllegalArgumentException("A vehicle with VIN '" + vehicle.getVin() + "' already exists.");
        }
        return vehicleRepository.save(vehicle);
    }

    @Override
    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));

        // Enforce business rule: VIN must be unique across other vehicles
        if (vehicleRepository.existsByVinAndIdNot(vehicleDetails.getVin(), id)) {
            throw new IllegalArgumentException("A vehicle with VIN '" + vehicleDetails.getVin() + "' already exists.");
        }

        // Map updated fields
        existingVehicle.setMake(vehicleDetails.getMake());
        existingVehicle.setModel(vehicleDetails.getModel());
        existingVehicle.setYear(vehicleDetails.getYear());
        existingVehicle.setColor(vehicleDetails.getColor());
        existingVehicle.setPrice(vehicleDetails.getPrice());
        existingVehicle.setVin(vehicleDetails.getVin());
        existingVehicle.setStatus(vehicleDetails.getStatus());

        return vehicleRepository.save(existingVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle existingVehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
        vehicleRepository.delete(existingVehicle);
    }
}
