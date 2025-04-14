FROM openjdk:17
EXPOSE 8089
COPY kaddem-0.0.1.jar /app/kaddem-0.0.1.jar
ENTRYPOINT ["java", "-jar", "/kaddem-0.0.1.jar"]
