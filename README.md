# Kaddem Application - University Management

This README provides instructions for testing the University Management endpoints in the Kaddem application.

## Prerequisites

- Java 8 installed
- JAVA_HOME environment variable set correctly
- Maven installed (or use included mvnw wrapper)
- Postman for API testing

## Running the Application

```powershell
# Set the JAVA_HOME environment variable (if needed)
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-8.0.432.6-hotspot"

# Run the application
./mvnw spring-boot:run
```

## Testing University Endpoints with Postman

Below are instructions for testing each university endpoint using Postman.

### 1. Get All Universities

- **Method**: GET
- **URL**: `http://localhost:8089/kaddem/universite/retrieve-all-universites`
- **Headers**: None required
- **Body**: None required

### 2. Get University by ID

- **Method**: GET
- **URL**: `http://localhost:8089/kaddem/universite/retrieve-universite/{id}`
- **Example**: `http://localhost:8089/kaddem/universite/retrieve-universite/1`
- **Headers**: None required
- **Body**: None required

### 3. Add New University

- **Method**: POST
- **URL**: `http://localhost:8089/kaddem/universite/add-universite`
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
- **URL**: `http://localhost:8089/kaddem/universite/update-universite`
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
- **URL**: `http://localhost:8089/kaddem/universite/remove-universite/{id}`
- **Example**: `http://localhost:8089/kaddem/universite/remove-universite/13`
- **Headers**: None required
- **Body**: None required

### 6. Assign Department to University

First, create a department:
- **Method**: POST
- **URL**: `http://localhost:8089/kaddem/departement/add-departement`
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
- **URL**: `http://localhost:8089/kaddem/universite/affecter-universite-departement/{universiteId}/{departementId}`
- **Example**: `http://localhost:8089/kaddem/universite/affecter-universite-departement/1/2`
- **Headers**: None required
- **Body**: None required

### 7. List Departments of a University

- **Method**: GET
- **URL**: `http://localhost:8089/kaddem/universite/listerDepartementsUniversite/{idUniversite}`
- **Example**: `http://localhost:8089/kaddem/universite/listerDepartementsUniversite/1`
- **Headers**: None required
- **Body**: None required

## Setting Up Collection in Postman

1. Open Postman
2. Click on "Collections" in the sidebar
3. Click "New Collection" and name it "Kaddem University API"
4. For each endpoint above:
   - Click "Add request" within the collection
   - Set the request name, method, URL, headers, and body as specified
   - Save the request

This approach allows you to save all API requests together for easy testing and reuse. 