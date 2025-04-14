# Kaddem Application - University Management

This README provides instructions for running the Kaddem University Management application, which consists of a Spring Boot backend and an Angular frontend.

## Prerequisites

- Java 17 installed
- JAVA_HOME environment variable set correctly
- Maven installed (or use included mvnw wrapper)
- Node.js and npm for frontend development
- Docker and Docker Compose for containerized deployment
- Postman for API testing (optional)

## Running the Application Locally

### Backend

```powershell
# Set the JAVA_HOME environment variable (if needed)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.xx-hotspot"

# Run the application
./mvnw spring-boot:run
```

The backend will start on http://localhost:8082/kaddem

### Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on http://localhost:4200

## Running with Docker Compose

You can run the entire application stack (MySQL, Spring Boot backend, Angular frontend, Prometheus, and Grafana) using Docker Compose:

```bash
# Build and start all services
docker-compose up -d
```

Then access:
- Frontend: http://localhost
- Backend API: http://localhost:8082/kaddem
- Prometheus: http://localhost:9091
- Grafana: http://localhost:3001 (default login: admin/admin)

## Testing University Endpoints with Postman

Below are instructions for testing each university endpoint using Postman.

### 1. Get All Universities

- **Method**: GET
- **URL**: `http://localhost:8082/kaddem/universite/retrieve-all-universites`
- **Headers**: None required
- **Body**: None required

### 2. Get University by ID

- **Method**: GET
- **URL**: `http://localhost:8082/kaddem/universite/retrieve-universite/{id}`
- **Example**: `http://localhost:8082/kaddem/universite/retrieve-universite/1`
- **Headers**: None required
- **Body**: None required

### 3. Add New University

- **Method**: POST
- **URL**: `http://localhost:8082/kaddem/universite/add-universite`
- **Headers**: 
  - Key: `Content-Type`
  - Value: `application/json`
- **Body**: 
  ```json
  {
    "nomUniv": "New University Name"
  }
  ```

### 4. Update University

- **Method**: PUT
- **URL**: `http://localhost:8082/kaddem/universite/update-universite`
- **Headers**: 
  - Key: `Content-Type`
  - Value: `application/json`
- **Body**: 
  ```json
  {
    "idUniv": 1,
    "nomUniv": "Updated University Name"
  }
  ```

### 5. Delete University

- **Method**: DELETE
- **URL**: `http://localhost:8082/kaddem/universite/remove-universite/{id}`
- **Example**: `http://localhost:8082/kaddem/universite/remove-universite/13`
- **Headers**: None required
- **Body**: None required

### 6. Assign Department to University

First, create a department:
- **Method**: POST
- **URL**: `http://localhost:8082/kaddem/departement/add-departement`
- **Headers**: 
  - Key: `Content-Type`
  - Value: `application/json`
- **Body**: 
  ```json
  {
    "nomDepart": "New Department"
  }
  ```

Then, assign the department to the university:
- **Method**: PUT
- **URL**: `http://localhost:8082/kaddem/universite/affecter-universite-departement/{universiteId}/{departementId}`
- **Example**: `http://localhost:8082/kaddem/universite/affecter-universite-departement/1/2`
- **Headers**: None required
- **Body**: None required

### 7. List Departments of a University

- **Method**: GET
- **URL**: `http://localhost:8082/kaddem/universite/listerDepartementsUniversite/{idUniversite}`
- **Example**: `http://localhost:8082/kaddem/universite/listerDepartementsUniversite/1`
- **Headers**: None required
- **Body**: None required

## Jenkins CI/CD

The repository includes a Jenkinsfile that sets up a complete CI/CD pipeline:

1. Builds and tests the backend application
2. Runs SonarQube analysis
3. Packages the application and deploys to Nexus
4. Builds and deploys Docker images for both backend and frontend
5. Starts the entire stack using Docker Compose

## Project Structure

- **Backend**: Spring Boot application with REST APIs
- **Frontend**: Angular application with components for University management
- **Docker**: Configuration for containerizing both applications
- **Monitoring**: Prometheus and Grafana for monitoring the application 