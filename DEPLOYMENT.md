# TripNest Deployment Guide for Render

## Issues Fixed

The following issues were preventing your server from connecting to Render:

1. **Route imports were after route usage** - Fixed by moving imports to the top
2. **Incorrect static file path** - Changed from `client/build` to `frontend/build`
3. **Missing environment variables** - Created template file
4. **Missing Render configuration** - Added render.yaml

## Deployment Steps

### 1. Environment Variables
Copy `env-template.txt` to `.env` and fill in your values:
```bash
cp env-template.txt .env
```

### 2. Render Deployment

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Render
3. Render will automatically detect the `render.yaml` file
4. Set up environment variables in Render dashboard

#### Option B: Manual Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command**: `npm run render-postbuild`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Node Version**: 18.x

### 3. Environment Variables in Render
Set these in your Render service dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Generate a secure random string
- `SESSION_SECRET`: Generate a secure random string
- `CLIENT_URL`: Your frontend URL (if deploying separately)

### 4. Database
- Use MongoDB Atlas for production
- Add the connection string to `MONGODB_URI`

### 5. Frontend Deployment
If deploying frontend separately:
1. Create another Web Service for the frontend
2. Set build command: `npm run build`
3. Set start command: `npx serve -s build`
4. Update `CLIENT_URL` in backend environment variables

## Common Issues

### CORS Errors
- Make sure `CLIENT_URL` is set correctly
- For development: `http://localhost:3000`
- For production: Your frontend URL

### Build Failures
- Ensure all dependencies are in `package.json`
- Check that frontend builds successfully locally

### Database Connection
- Use MongoDB Atlas for production
- Ensure connection string includes authentication
- Whitelist Render's IP addresses in MongoDB Atlas

## Testing Deployment
After deployment, test these endpoints:
- `GET /` - Should return welcome message
- `GET /api/hotels` - Should return hotels data
- `GET /api/restaurants` - Should return restaurants data
- `GET /api/attractions` - Should return attractions data

## Troubleshooting
1. Check Render logs for errors
2. Verify environment variables are set
3. Test database connection
4. Check CORS configuration
5. Ensure all routes are properly imported
