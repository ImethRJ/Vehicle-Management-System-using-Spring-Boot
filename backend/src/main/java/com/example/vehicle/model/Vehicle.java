package com.example.vehicle.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Represents a Vehicle entity in the system.
 * Designed with standard JSR-380 validation and clean POJO fields.
 */
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Make is required")
    @Size(min = 2, max = 50, message = "Make must be between 2 and 50 characters")
    private String make;

    @NotBlank(message = "Model is required")
    @Size(min = 1, max = 50, message = "Model must be between 1 and 50 characters")
    private String model;

    @NotNull(message = "Year is required")
    @Min(value = 1886, message = "Year must be at least 1886 (birth of the automobile)")
    @Max(value = 2100, message = "Year must be a realistic future year")
    @Column(name = "production_year")
    private Integer year;

    @NotBlank(message = "Color is required")
    private String color;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be a positive number or zero")
    private Double price;

    @NotBlank(message = "VIN is required")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    @Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must be a valid 17-character alphanumeric string (excluding I, O, Q)")
    @Column(unique = true)
    private String vin;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(Available|Sold|Maintenance)$", message = "Status must be Available, Sold, or Maintenance")
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public Vehicle() {
        this.createdAt = LocalDateTime.now();
    }

    public Vehicle(String make, String model, Integer year, String color, Double price, String vin, String status) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.price = price;
        this.vin = vin;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
