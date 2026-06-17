# Vehicle Management System (VehicleOS)

A decoupled, full-stack web application designed to track, manage, and monitor a vehicle fleet. 

---

## 📖 For Non-Technical People (The Business View)

### What is this project?
Think of this application as a **digital control center** for a car dealership or a rental car company. Instead of using complex spreadsheets or paper logs to keep track of cars, this app provides a clean, visual dashboard.

### Key Features:
* **Live Fleet Dashboard**: Instantly see how many total vehicles are in your fleet, how many are ready to be driven (`Available`), how many have been `Sold`, and how many are currently in the shop (`In Maintenance`).
* **Instant Search & Filter**: Type in any color, model, status, or vehicle number (VIN) to find a car in seconds. You can also filter the list by status with a single click.
* **Easy Registrations & Updates**: Add new vehicles to the fleet or change the status/price of existing ones using a simple, guided form.
* **Guardrails**: The system prevents typing mistakes (like registration numbers that are too short, or negative pricing) to keep your fleet data clean.

---

## 💻 For Technical People (The Engineering View)

This system is built using a **decoupled client-server architecture**, dividing frontend presentation from backend data control.

### System Architecture Flow:
1. **Frontend (React)** makes asynchronous HTTP REST calls using the native browser `Fetch API`.
2. **CORS Security Configuration** intercepts incoming requests to authorize communication between separate local hosting ports.
3. **REST Controllers (Spring MVC)** serialize and deserialize data models using JSON format.
4. **Service Implementation Layer** coordinates transactional business constraints (e.g. enforcing VIN uniqueness).
5. **Data Access Object (Spring Data JPA)** translates operations into SQL queries using Hibernate ORM.
6. **In-Memory SQL Database (H2)** stores active records in temporary memory for high-performance development.

### Backend Tech Stack:
* **Java 21** (Modern LTS runtime)
* **Spring Boot 3.4.1** (Web, JPA Data, Jakarta Bean Validation)
* **H2 Database Engine** (In-memory development database)
* **Maven** (Dependency builder)

### Frontend Tech Stack:
* **React 19** (Single-page component interface)
* **Vite** (Next-generation dev server and module builder)
* **Vanilla CSS** (Custom theme system with responsive glassmorphism styles)
* **Lucide React** (Vector icons)

---

## 🔌 API Endpoints Summary

All backend API requests use the base URL `http://localhost:8080/api/vehicles`.

| Method | Endpoint | Query Param | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/vehicles` | `search` (Optional) | Retrieves all vehicles, or searches by make, model, color, status, or VIN. |
| **GET** | `/api/vehicles/{id}` | - | Retrieves a single vehicle by its database primary key. |
| **POST** | `/api/vehicles` | - | Registers a new vehicle. Performs unique VIN database checking. |
| **PUT** | `/api/vehicles/{id}` | - | Updates details of an existing vehicle by ID. |
| **DELETE**| `/api/vehicles/{id}` | - | Permanently deletes a vehicle from fleet database logs. |

---

## 🚀 How to Run the Project Locally

### Prerequisites
Before running, ensure you have the following installed:
1. **Java Development Kit (JDK) 21**
2. **Node.js** (v18 or higher recommended)
3. **Maven** (optional, you can use maven wrapper if available, or IDE integrations)

---

### Step 1: Start the Spring Boot Backend Server
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and run the project using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on port `8080`.
4. **H2 Database Console**: You can view the live database tables in your browser at `http://localhost:8080/h2-console`. 
   * **JDBC URL**: `jdbc:h2:mem:vehicledb`
   * **Username**: `sa`
   * **Password**: *(Leave blank)*

---

### Step 2: Start the React Frontend App
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required packages:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL in your browser (usually `http://localhost:5173`).
