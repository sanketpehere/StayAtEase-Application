# Use official Java image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Give permission to mvnw
RUN chmod +x mvnw

# Build application
RUN ./mvnw clean package -DskipTests

# Expose Spring Boot port
EXPOSE 7803

# Run application
CMD ["java", "-jar", "target/core-app-0.0.1-SNAPSHOT.jar"]