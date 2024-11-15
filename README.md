# Remix Weather App

This is a weather application built with Remix. It fetches weather data and displays it based on user input.

## Prerequisites

Before you start, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (or access to a MongoDB cluster)
- Git (optional, if you want to clone the repo)

## Getting Started

Follow the steps below to set up and run the application locally.

### 1. Clone the Repository

If you haven't already cloned the repository, you can do so by running the following command:


```bash
git clone <repository_url>
cd <repository_name>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
DATABASE_URL=""
SESSION_SECRET="="
VITE_WEATHER_API_KEY="="
```
### 4. Install Prisma Dependencies
```bash
npm install @prisma/client
npm install prisma --save-dev
```
### 5. Generate Prisma Client 
```bash
npx prisma generate
npx prisma migrate dev
```
### 6. Run the Application Locally
```bash
npm run dev
```
