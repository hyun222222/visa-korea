@echo off
cd /d "%~dp0"
echo Installing requirements...
python -m pip install -r requirements.txt
echo.
echo Starting the program...
echo Folders (input, processed, error) will be created automatically.
echo.
python main.py
pause
