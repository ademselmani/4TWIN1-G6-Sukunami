# Kaddem Application Docker Setup

This document explains how to run the Kaddem application using Docker and integrate it with Nexus Repository Manager.

## Prerequisites

1. Docker and Docker Compose installed
2. Nexus Repository Manager running on 192.168.230.129:8081
3. Maven configured with settings.xml

## Docker Setup

This project includes the following Docker files:

1. **Backend Dockerfile**: Builds the Java application container
2. **Frontend Dockerfile**: Builds the Angular application container
3. **docker-compose.yml**: Orchestrates the entire application stack

## Running with Docker

### Manual Docker Build and Run

1. Build the backend JAR:
   ```bash
   mvn clean package -DskipTests
   ```

2. Build the backend Docker image:
   ```bash
   docker build -t mohamedbsila/kaddem:latest .
   ```

3. Build the frontend Docker image:
   ```bash
   cd frontend
   docker build -t mohamedbsila/kaddem-frontend:latest .
   ```

4. Run using Docker Compose:
   ```bash
   docker-compose up -d
   ```

5. Access the application at http://localhost

### Using Jenkins Pipeline

The Jenkins pipeline automates the entire process:
1. Builds the backend application
2. Deploys to Nexus
3. Builds the frontend application
4. Builds and pushes Docker images for both backend and frontend
5. Deploys the entire stack using Docker Compose

## Docker Compose Services

The `docker-compose.yml` file defines:

1. **MySQL Database**:
   - Port: 3306
   - Username: root
   - Password: root
   - Database: kaddem

2. **Kaddem Backend Application**:
   - Port: 8082
   - Context path: /kaddem
   - Depends on MySQL

3. **Kaddem Frontend Application**:
   - Port: 80
   - Depends on Kaddem Backend

4. **Prometheus**:
   - Port: 9091
   - Configured to monitor the Kaddem backend

5. **Grafana**:
   - Port: 3001
   - Configured to visualize Prometheus metrics

## Credentials

- **Docker Hub**: 
  - Username: mohamedbsila
  - Password: b52100610

- **Nexus**:
  - URL: http://192.168.230.129:8081
  - Username: admin
  - Password: b52100610

## Troubleshooting

1. **Container Issues**: Check container logs with `docker logs <container-name>`
2. **Database Connection**: Ensure MySQL is running and accessible from the app container
3. **Port Conflicts**: Make sure ports 80, 8082, 3306, 9091, and 3001 are not already in use
4. **Frontend-Backend Communication**: Verify the frontend can reach the backend API through the proxy

## Additional Information

For more details on Nexus integration, refer to the NEXUS-README.md file. 