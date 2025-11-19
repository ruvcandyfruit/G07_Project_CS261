# Use Java 17 base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory inside container
WORKDIR /app

# Copy built JAR from target/
COPY target/*.jar app.jar

# Expose app port
EXPOSE 8081

# Run the Spring Boot JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
