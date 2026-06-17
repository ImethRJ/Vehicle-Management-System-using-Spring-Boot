package com.example.vehicle;

import com.example.vehicle.model.Vehicle;
import com.example.vehicle.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * Main application class to launch the Spring Boot microservice.
 */
@SpringBootApplication
public class VehicleApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehicleApplication.class, args);
    }

    /**
     * Seeds the H2 database with demo data on startup to make testing easier.
     */
    @Bean
    public CommandLineRunner databaseSeeder(VehicleRepository repository) {
        return args -> {
            // Check if DB is empty before seeding
            if (repository.count() == 0) {
                repository.save(new Vehicle("Tesla", "Model S", 2023, "Deep Blue Metallic", 89990.00, "5YJSA1E11PFP12345", "Available"));
                repository.save(new Vehicle("Toyota", "RAV4 Hybrid", 2022, "Magnetic Gray Metallic", 34500.00, "JTMWRRFV9ND123456", "Available"));
                repository.save(new Vehicle("Ford", "Mustang Mach-E", 2021, "Rapid Red", 45900.00, "1FMCU9GD0MP123456", "Maintenance"));
                repository.save(new Vehicle("BMW", "M4 Competition", 2023, "Alpine White", 78600.00, "WBS53AY06NFP12345", "Sold"));
                repository.save(new Vehicle("Chevrolet", "Bolt EV", 2020, "Slate Gray Metallic", 26500.00, "1G1FY6S08L4123456", "Available"));
                
                System.out.println(">>> Database seeded successfully with 5 sample vehicles!");
            }
        };
    }
}
