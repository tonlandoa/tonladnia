@echo off
setlocal enabledelayedexpansion

:: Получаем дату и время
for /f "tokens=1-3 delims=/: " %%a in ("%date% %time%") do (
    set "datetime=%%a-%%b-%%c"
)

:: Сообщение коммита
set "COMMIT_MSG=Update For %datetime%"

echo [%datetime%] Starting Git operations...

:: Git add
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files >> git-error.log
    echo [ERROR] Failed to add files. See git-error.log
    exit /b 1
)

:: Git commit
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo [ERROR] Failed to commit changes >> git-error.log
    echo [ERROR] Failed to commit changes. See git-error.log
    exit /b 1
)

:: Git push
git push
if errorlevel 1 (
    echo [ERROR] Failed to push to remote >> git-error.log
    echo [ERROR] Failed to push to remote. See git-error.log
    exit /b 1
)

echo [%datetime%] Git operations completed successfully.
exit /b 0
