# Kaddem Application Docker Setup

This document explains how to run the Kaddem application using Docker and integrate it with Nexus Repository Manager.

## Prerequisites

1. Docker and Docker Compose installed
2. Nexus Repository Manager running on 192.168.230.129:8081
3. Maven configured with settings.xml

## Docker Setup

This project includes the following Docker files:

1. **Dockerfile**: Builds the Java application container
2. **docker-compose.yml**: Orchestrates the application and MySQL database

## Running with Docker

### Manual Docker Build and Run

1. Build the application JAR:
   ```bash
   mvn clean package -DskipTests
   ```

2. Build the Docker image:
   ```bash
   docker build -t moha/kaddem .
   ```

3. Run using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application at http://localhost:8082/kaddem

### Using Jenkins Pipeline

The Jenkins pipeline automates the entire process:
1. Builds the application
2. Deploys to Nexus
3. Builds and pushes the Docker image
4. Deploys using Docker Compose

## Docker Compose Services

The `docker-compose.yml` file defines:

1. **MySQL Database**:
   - Port: 3306
   - Username: root
   - Password: root
   - Database: kaddem

2. **Kaddem Application**:
   - Port: 8082
   - Context path: /kaddem
   - Depends on MySQL

## Credentials

- **Docker Hub**: 
  - Username: moha
  - Password: b52100610

- **Nexus**:
  - URL: http://192.168.230.129:8081
  - Username: admin
  - Password: b52100610

## Troubleshooting

1. **Container Issues**: Check container logs with `docker logs kaddem-app`
2. **Database Connection**: Ensure MySQL is running and accessible from the app container
3. **Port Conflicts**: Make sure ports 8082 and 3306 are not already in use

## Additional Information

For more details on Nexus integration, refer to the NEXUS-README.md file. 