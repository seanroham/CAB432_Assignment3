# CAB432_Assignment3

# Back-End Microservices Project

This project includes four separate Node.js microservices designed to run on different ports. Each microservice has its own purpose and dependencies, specified in individual `package.json` files. This setup allows each service to be deployed independently and communicate with others as needed.

## Microservices Overview

- **Auth Service**: Manages user authentication, including login and signup.  
  - **Runs on Port**: `3003`
- **Video Uploader Service**: Provides a pre-signed URL to upload videos to an S3 bucket.  
  - **Runs on Port**: `3000`
- **Media Processor Service**: Processes video files (e.g., transcoding and audio extraction).  
  - **Runs on Port**: `3002`
- **Video Metadata Fetcher Service**: Retrieves metadata and stored information about uploaded videos.  
  - **Runs on Port**: `3001`

---

## Project Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### Step 2: Create `.env` Files for Each Microservice

Each microservice requires an `.env` file in its root directory. Below is the format for the `.env` file that you need to create for each service, which includes AWS credentials, S3 bucket information, and allowed origins.

```bash
# Example .env file for each microservice
ALLOWED_ORIGIN=http://localhost:3005  # Replace with the actual frontend URL if needed
S3_BUCKET_NAME=n10937668-a2
AWS_REGION=ap-southeast-2
aws_access_key_id=###              # Replace with your AWS access key ID
aws_secret_access_key=###           # Replace with your AWS secret access key
aws_session_token=###               # Optional, only if you use session tokens
```

### Step 3: Install Dependencies for Each Microservice

Navigate to each microservice directory and run `npm install` to install dependencies. Each microservice has its own `package.json` with only the required dependencies listed.

```bash
# In each microservice directory
cd auth-service
npm install
```

Repeat for each service:
- `auth-service`
- `video-uploader`
- `media-processor`
- `video-fetcher`

### Step 4: Troubleshooting Missing Dependencies

If you encounter errors related to missing dependencies, you can manually check for missing packages by running the service and looking at the error messages. Install any missing dependencies as follows:

```bash
npm install <missing-package-name>
```

Alternatively, you can use tools like `depcheck`:
```bash
npm install -g depcheck
depcheck
```

This will identify any missing dependencies that can be installed.

### Step 5: Running Each Service Locally

Each service runs on a different port. Start each service in its own terminal window or tab as follows:

```bash
# Start Auth Service (port 3003)
cd auth-service
npm start

# Start Video Uploader Service (port 3000)
cd video-uploader
npm start

# Start Media Processor Service (port 3002)
cd media-processor
npm start

# Start Video Metadata Fetcher Service (port 3001)
cd video-fetcher
npm start
```

### Step 6: Docker Deployment

Each service can be containerized with Docker. Below are the Dockerfile templates for each service, followed by instructions for building and running containers.

#### Dockerfile for Each Microservice

Each service has a similar Dockerfile with minor changes for each port. Here’s a template:

```bash
# Dockerfile

# Use Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port each app runs on (change port number for each service)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
```

For each service, change the `EXPOSE` port in the Dockerfile to match the service port.

#### Build and Run Docker Containers

Navigate to each microservice directory and run:

```bash
# Build the Docker image for the service
docker build -t <service-name> .

# Run the Docker container for the service
docker run -d -p <host-port>:<container-port> --env-file .env <service-name>
```

Example commands for each service:

```bash
# Auth Service
cd auth-service
docker build -t auth-service .
docker run -d -p 3003:3003 --env-file .env auth-service

# Video Uploader Service
cd video-uploader
docker build -t video-uploader .
docker run -d -p 3000:3000 --env-file .env video-uploader

# Media Processor Service
cd media-processor
docker build -t media-processor .
docker run -d -p 3002:3002 --env-file .env media-processor

# Video Metadata Fetcher Service
cd video-fetcher
docker build -t video-fetcher .
docker run -d -p 3001:3001 --env-file .env video-fetcher
```

---

## Front-End React Project - `README.md`

# Front-End React Project

## Project Setup

This front-end project is designed to connect with the back-end microservices and display data and interact with them via APIs. It uses environment variables for configuration.

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd frontend
```

### Step 2: Create `.env` File

Create an `.env` file in the root directory of the React project and specify the base URL for the backend API.

```bash
REACT_APP_API_URL=http://localhost:3000  # Replace with the actual backend URL if needed
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run the Project Locally

To run the React project in development mode:

```bash
npm start
```

### Step 5: Docker Deployment for React

The front-end can be deployed with Docker as well. Here’s a Dockerfile for the React project:

```bash
# Dockerfile

# Use Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3005

# Serve the app
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3005"]
```

Build and run the Docker container for the React app:

```bash
docker build -t frontend-app .
docker run -d -p 3005:3005 --env-file .env frontend-app
```

---

## Troubleshooting

- **Missing Dependencies**: Use `npm install <package-name>` if you see any missing dependencies.
- **Environment Variables**: Ensure all `.env` files are set up correctly for each service and frontend.
- **Docker Issues**: Check that Docker is properly installed and the Dockerfiles are configured for each specific service and frontend.

This setup provides a fully containerized, microservices-based architecture with a frontend that connects to all back-end services. You can run everything locally or with Docker as needed.
