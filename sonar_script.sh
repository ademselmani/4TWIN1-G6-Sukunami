#!/bin/bash

# Compile and test the project
mvn clean verify

# Run SonarQube analysis
mvn sonar:sonar 