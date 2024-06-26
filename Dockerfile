# Use the official Node.js image as the base image
FROM node:22.1.0

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Run the seeding script
RUN npm run seed

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "run", "dev"]
