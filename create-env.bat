@echo off
echo Creating .env file for TripNest...

echo MONGODB_URI=mongodb://localhost:27017/tripnest > .env
echo PORT=5000 >> .env
echo JWT_SECRET=your_jwt_secret_here >> .env
echo NODE_ENV=development >> .env

echo.
echo .env file created successfully!
echo.
echo Contents:
type .env
echo.
echo Now you can run: npm run server
pause 