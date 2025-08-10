# Deploying Chat App to Render

## Prerequisites

- Render account
- MongoDB database (MongoDB Atlas recommended)
- Cloudinary account (for image uploads)

## Deployment Steps

### 1. Prepare Your Repository

- Ensure your code is pushed to GitHub/GitLab
- The backend folder should contain both backend and frontend code

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Connect your repository to Render
2. Render will automatically detect the `render.yaml` file
3. Set your environment variables in the Render dashboard

#### Option B: Manual Setup

1. Create a new **Web Service** on Render
2. Connect your repository
3. Set the following:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 3. Environment Variables

Set these in your Render dashboard:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-app-name.onrender.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=10000
```

### 4. Build Process

The build command (`npm run build`) will:

1. Install frontend dependencies
2. Build the React app to `frontend/dist/`
3. The backend will serve these static files

### 5. Start Process

The start command (`npm start`) will:

1. Start the Node.js server
2. Serve the built frontend from `frontend/dist/`
3. Handle API requests and serve the SPA

## Important Notes

- Render will automatically assign a port (usually 10000)
- The frontend is built and served by the backend
- CORS is configured to allow your Render domain
- All routes fall back to the React app for SPA routing

## Troubleshooting

- Check Render logs for build/start errors
- Ensure all environment variables are set
- Verify MongoDB connection string
- Check if Cloudinary credentials are correct
