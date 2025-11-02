@echo off
REM Debug batch to run server and client in visible consoles for testing
REM Run this from the project root where server/ and client/ folders live

if exist server\server.py (
    echo Starting server in new window...
    start "Server" cmd /k python server\server.py
) else if exist server.py (
    echo Starting server.py...
    start "Server" cmd /k python server.py
) else (
    echo No server script found.
)

if exist client\client.py (
    echo Starting client in new window...
    start "Client" cmd /k python client\client.py
) else if exist client.py (
    echo Starting client.py...
    start "Client" cmd /k python client.py
) else (
    echo No client script found.
)

echo Done. Close these windows to stop the processes (or use Task Manager).
pause
````markdown name=README.md
```markdown
# start_all launcher — README

What this is
- A simple launcher to start both server and client for your project.
- It looks for:
  - server/server.py or server.py
  - client/client.py or client.py
- When started it launches each script in the background and writes logs to `logs/server.log` and `logs/client.log`.

How to add these files to your repository (git CLI)
1. Open a terminal (or Git Bash) in your local copy of the repo.
2. Create a new branch:
