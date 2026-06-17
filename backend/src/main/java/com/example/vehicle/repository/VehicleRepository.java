package com.example.vehicle.repository;

import com.example.vehicle.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Data Access Layer for Vehicle entities.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Finds a vehicle by its unique VIN.
     */
    Optional<Vehicle> findByVin(String vin);

    /**
     * Checks if a vehicle with the given VIN exists.
     */
    boolean existsByVin(String vin);

    /**
     * Checks if a vehicle with the given VIN exists, excluding a specific vehicle ID.
     * Useful for validation during updates.
     */
    boolean existsByVinAndIdNot(String vin, Long id);

    /**
     * Searches for vehicles matching make, model, color, or status (case-insensitive).
     */
    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.color) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.status) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.vin) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> searchVehicles(@Param("query") String query);
}
