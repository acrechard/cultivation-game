@echo off
echo 正在检查 MongoDB 安装状态...

REM 检查 MongoDB 是否已安装
where mongod >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo MongoDB 未安装或未添加到系统 PATH
    echo 请先安装 MongoDB Community Server
    echo 下载地址: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

echo MongoDB 已安装，正在启动 MongoDB 服务...

REM 创建数据目录（如果不存在）
if not exist "C:\data\db" (
    echo 创建数据目录 C:\data\db
    mkdir "C:\data\db"
)

REM 尝试启动 MongoDB
echo 启动 MongoDB 服务...
start /b mongod --dbpath "C:\data\db" --port 27017

timeout /t 3 /nobreak >nul

REM 测试连接
echo 测试 MongoDB 连接...
mongo --eval "db.runCommand({ping:1})" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo MongoDB 连接成功！
) else (
    echo MongoDB 连接失败，请检查服务是否正常启动
)

echo.
echo MongoDB 已启动，监听端口 27017
echo 您现在可以启动后端服务了
echo.
pause