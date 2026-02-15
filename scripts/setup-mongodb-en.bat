@echo off
chcp 65001 > nul
echo Checking MongoDB installation status...

REM 检查 MongoDB 是否已安装
where mongod >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo MongoDB is not installed or not added to system PATH
    echo Please install MongoDB Community Server first
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo MongoDB is installed, starting MongoDB service...

REM 创建数据目录（如果不存在）
if not exist "C:\data\db" (
    echo Creating data directory C:\data\db
    mkdir "C:\data\db" >nul 2>&1
)

REM 尝试启动 MongoDB
echo Starting MongoDB service...
start /b mongod --dbpath "C:\data\db" --port 27017

timeout /t 3 /nobreak >nul

REM Test connection
echo Testing MongoDB connection...
mongo --eval "db.runCommand({ping:1})" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo MongoDB connection successful!
) else (
    echo MongoDB connection failed, please check if the service is running
)

echo.
echo MongoDB is now running on port 27017
echo You can now start the backend service
echo.
pause