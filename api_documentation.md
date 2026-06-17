# REST API Documentation - Vehicle Management System

This document outlines the REST API endpoints exposed by the Spring Boot backend server. You can use this outline to configure your **Postman** collection or write API client utilities.

---

## Global Details

- **Base URL**: `http://localhost:8080`
- **Default Port**: `8080`
- **Default Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json`

---

## Endpoints

### 1. Get All Vehicles (with search option)
Retrieves all registered vehicles, or filters them based on a search term.

- **Method**: `GET`
- **Path**: `/api/vehicles`
- **Query Parameters**:
  - `search` *(Optional, String)*: Filters vehicles by make, model, color, status, or VIN (case-insensitive substring search).
- **HTTP Success Code**: `200 OK`
- **Sample Response**:
```json
[
  {
    "id": 1,
    "make": "Tesla",
    "model": "Model S",
    "year": 2023,
    "color": "Deep Blue Metallic",
    "price": 89990.00,
    "vin": "5YJSA1E11PFP12345",
    "status": "Available",
    "createdAt": "2026-06-17T12:00:00"
  },
  {
    "id": 2,
    "make": "Toyota",
    "model": "RAV4 Hybrid",
    "year": 2022,
    "color": "Magnetic Gray Metallic",
    "price": 34500.00,
    "vin": "JTMWRRFV9ND123456",
    "status": "Available",
    "createdAt": "2026-06-17T12:00:00"
  }
]
```

---

### 2. Get Vehicle by ID
Retrieves details of a single vehicle by its database primary key.

- **Method**: `GET`
- **Path**: `/api/vehicles/{id}`
- **Path Parameters**:
  - `id` *(Required, Long)*: The ID of the vehicle.
- **HTTP Success Code**: `200 OK`
- **HTTP Error Code**: `404 Not Found` (when no vehicle with the given ID exists).
- **Sample Error Response (404)**:
```json
{
  "timestamp": "2026-06-17T12:15:33.456",
  "status": 404,
  "error": "Not Found",
  "message": "Vehicle not found with ID: 99",
  "path": "/api/vehicles/99",
  "errors": null
}
```

---

### 3. Create Vehicle
Creates and registers a new vehicle in the system.

- **Method**: `POST`
- **Path**: `/api/vehicles`
- **HTTP Success Code**: `201 Created`
- **HTTP Error Codes**: 
  - `400 Bad Request` (payload validation checks failed or duplicate VIN).
- **Request Body (JSON)**:
```json
{
  "make": "Ford",
  "model": "F-150 Lightning",
  "year": 2023,
  "color": "Antimatter Blue",
  "price": 55974.00,
  "vin": "1FTVW1EV4NW123456",
  "status": "Available"
}
```
- **Sample Success Response (201)**:
```json
{
  "id": 6,
  "make": "Ford",
  "model": "F-150 Lightning",
  "year": 2023,
  "color": "Antimatter Blue",
  "price": 55974.00,
  "vin": "1FTVW1EV4NW123456",
  "status": "Available",
  "createdAt": "2026-06-17T12:20:10.123"
}
```
- **Sample Error Response (400 - Validation Failed)**:
```json
{
  "timestamp": "2026-06-17T12:22:15.654",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed: Please check request payload",
  "path": "/api/vehicles",
  "errors": {
    "vin": "VIN must be a valid 17-character alphanumeric string (excluding I, O, Q)",
    "year": "Year must be at least 1886 (birth of the automobile)"
  }
}
```
- **Sample Error Response (400 - Duplicate VIN Business Constraint)**:
```json
{
  "timestamp": "2026-06-17T12:23:45.321",
  "status": 400,
  "error": "Bad Request",
  "message": "A vehicle with VIN '5YJSA1E11PFP12345' already exists.",
  "path": "/api/vehicles",
  "errors": null
}
```

---

### 4. Update Vehicle
Updates the details of an existing vehicle. The VIN can be updated but must remain unique among all other vehicles in the database.

- **Method**: `PUT`
- **Path**: `/api/vehicles/{id}`
- **Path Parameters**:
  - `id` *(Required, Long)*: The ID of the vehicle to update.
- **HTTP Success Code**: `200 OK`
- **HTTP Error Codes**: 
  - `404 Not Found` (vehicle ID doesn't exist).
  - `400 Bad Request` (payload validation failed or duplicate VIN collision with another vehicle).
- **Request Body (JSON)**:
```json
{
  "make": "Tesla",
  "model": "Model S Plaid",
  "year": 2023,
  "color": "Solid Black",
  "price": 109990.00,
  "vin": "5YJSA1E11PFP12345",
  "status": "Maintenance"
}
```
- **Sample Success Response (200)**:
```json
{
  "id": 1,
  "make": "Tesla",
  "model": "Model S Plaid",
  "year": 2023,
  "color": "Solid Black",
  "price": 109990.00,
  "vin": "5YJSA1E11PFP12345",
  "status": "Maintenance",
  "createdAt": "2026-06-17T12:00:00"
}
```

---

### 5. Delete Vehicle
Deletes a vehicle from the system by ID.

- **Method**: `DELETE`
- **Path**: `/api/vehicles/{id}`
- **Path Parameters**:
  - `id` *(Required, Long)*: The ID of the vehicle to delete.
- **HTTP Success Code**: `204 No Content` (indicates successful deletion with no body content returned).
- **HTTP Error Code**: `404 Not Found` (vehicle ID doesn't exist).

---

## Database Console Access (H2 Console)

You can view the in-memory database tables directly through the browser.

- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:vehicledb`
- **Username**: `sa`
- **Password**: *(Leave blank)*
