@echo off
echo Starting Smart Waste Management System...
echo.

echo Building the application...
call mvn clean package -DskipTests

if %ERRORLEVEL% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo Build successful! Starting the application...
echo.
echo The application will be available at: http://localhost:8080
echo API endpoints will be available at: http://localhost:8080/api/
echo.
echo Press Ctrl+C to stop the application
echo.

java -jar target/smartwaste-0.0.1-SNAPSHOT.jar

pause
