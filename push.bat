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
    pause
    exit /b 1
)

:: Git commit
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo [ERROR] Failed to commit changes >> git-error.log
    echo [ERROR] Failed to commit changes. See git-error.log
    pause
    exit /b 1
)

:: Проверка, есть ли upstream для текущей ветки
git rev-parse --abbrev-ref --symbolic-full-name @{u} >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Upstream не настроен. Устанавливаем upstream для ветки main...
    git push -u origin main
) else (
    git push
)

if errorlevel 1 (
    echo [ERROR] Failed to push to remote >> git-error.log
    echo [ERROR] Failed to push to remote. See git-error.log
    pause
    exit /b 1
)

echo [%datetime%] Git operations completed successfully.
pause
exit /b 0
