# Chat App

A real-time chat application built with React, Node.js, Socket.io, and MongoDB.

## 🚀 Quick Start

### **Option 1: Run Both Frontend & Backend Together (Recommended)**

```bash
# Install dependencies and run both servers
npm run dev
```

### **Option 2: Run Separately**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🌍 Environment Configuration

### **Local Development**

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`

### **Production (Render)**

- **App URL**: `https://chat-app-8snn.onrender.com`
- **API Base**: `https://chat-app-8snn.onrender.com/api`

## 📁 Project Structure

```
CHAT-APP/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Utilities & Socket.io
│   │   └── index.js        # Main server file
│   └── package.json
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   └── lib/            # Utilities & Axios
│   └── package.json
└── package.json             # Root package.json
```

## 🛠️ Available Scripts

### **Root Directory**

```bash
npm run dev          # Run both frontend & backend
npm run build        # Build for production (Render)
npm run build:local  # Build for local development
npm start           # Start production server
```

### **Backend Directory**

```bash
cd backend
npm run dev         # Start backend with nodemon
npm start          # Start production backend
```

### **Frontend Directory**

```bash
cd frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm preview        # Preview production build
```

## 🔧 Environment Variables

### **Backend (.env)**

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### **Frontend (.env.local)**

```env
VITE_API_URL=http://localhost:5000
```

### **Frontend (.env.production)**

```env
VITE_API_URL=https://chat-app-8snn.onrender.com
```

## 🚀 Deployment

### **Render Deployment**

1. Connect your GitHub repository to Render
2. Use the `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy automatically on git push

### **Local Network Access**

```bash
# Make backend accessible on local network
cd backend
npm run dev

# Access from other devices on same network
# http://YOUR_LOCAL_IP:5000
```

## 📱 Features

- ✅ User authentication (signup/login)
- ✅ Real-time messaging
- ✅ User profiles
- ✅ Responsive design
- ✅ Socket.io for live updates
- ✅ MongoDB for data persistence
- ✅ JWT authentication
- ✅ CORS configured for both local and production

## 🔍 Troubleshooting

### **Common Issues**

1. **Port already in use**

   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   ```

2. **MongoDB connection failed**

   - Check your MongoDB URI
   - Ensure network access is enabled

3. **CORS errors**

   - Frontend and backend URLs must match
   - Check environment variables

4. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📞 Support

If you encounter any issues:

1. Check the console logs
2. Verify environment variables
3. Ensure both servers are running
4. Check network connectivity

---

**Happy Chatting! 🎉**
