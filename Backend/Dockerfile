# Use an official Maven image with Java 21 and Maven 3.8.8 for the build stage
FROM maven:3.8.8-eclipse-temurin-21 as build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and any other necessary Maven files
COPY pom.xml .

# Download dependencies (This step helps to cache dependencies in Docker)
RUN mvn dependency:go-offline

# Copy the rest of the project files into the container
COPY . .

# Package the application as a JAR file
RUN mvn clean package -DskipTests

# Use a lightweight JDK 21 runtime image for the final build stage
FROM eclipse-temurin:21-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the packaged JAR file from the build stage
COPY --from=build /app/target/taskManager-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (adjust if your application runs on a different port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
