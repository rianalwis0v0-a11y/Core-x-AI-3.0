#!/usr/bin/env python3
"""
Launcher script to start server and client scripts.
This version embeds session metadata (timestamp and user login)
and writes it into logs and launcher_info.txt.

Place this file in the project root (same level as server/ and client/).
"""
import os
import sys
import subprocess
import time
from datetime import datetime

# --- Embedded session info (as requested) ---
CURRENT_DATETIME = "2025-11-02 11:29:07"  # UTC
CURRENT_USER_LOGIN = "rianalwis0v0-a11y"
# --------------------------------------------

def find_pythonw():
    exe = sys.executable or "python"
    if exe and exe.lower().endswith("python.exe"):
        candidate = os.path.join(os.path.dirname(exe), "pythonw.exe")
        if os.path.exists(candidate):
            return candidate
    candidate = os.path.join(os.path.dirname(exe), "pythonw.exe")
    if os.path.exists(candidate):
        return candidate
    return exe

def ensure_dir(path):
    try:
        os.makedirs(path, exist_ok=True)
    except Exception:
        pass

def start_process(script_path, log_path, use_detach=True):
    if not os.path.exists(script_path):
        print(f"Missing: {script_path}")
        return None

    python_exec = find_pythonw()
    cmd = [python_exec, script_path]

    # Open log file for append (binary so we can write bytes if needed)
    stdout = open(log_path, "ab")
    stderr = subprocess.STDOUT

    creationflags = 0
    if os.name == "nt" and use_detach:
        # Detach so the process keeps running after launcher exits
        CREATE_NEW_PROCESS_GROUP = 0x00000200
        DETACHED_PROCESS = 0x00000008
        creationflags = CREATE_NEW_PROCESS_GROUP | DETACHED_PROCESS

    try:
        proc = subprocess.Popen(cmd, stdout=stdout, stderr=stderr, creationflags=creationflags)
        return proc
    except Exception as e:
        print(f"Failed to start {script_path}: {e}")
        return None

def find_script_candidates():
    candidates = {
        "server": ["server/server.py", "server.py"],
        "client": ["client/client.py", "client.py"]
    }
    found = {}
    for role, paths in candidates.items():
        for p in paths:
            if os.path.exists(p):
                found[role] = os.path.abspath(p)
                break
    return found

def write_launcher_info(base, logs_dir):
    info_path = os.path.join(base, "launcher_info.txt")
    header = [
        f"launcher_run_time_system: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"embedded_current_datetime: {CURRENT_DATETIME}",
        f"embedded_user_login: {CURRENT_USER_LOGIN}",
        f"launcher_working_dir: {base}",
        "",
    ]
    try:
        with open(info_path, "w", encoding="utf-8") as f:
            f.write("\n".join(header))
        # Also write header into each log file (if created)
        for name in ("server.log", "client.log"):
            lp = os.path.join(logs_dir, name)
            # create/append the header to log file
            try:
                with open(lp, "ab") as lf:
                    lf.write(("\n".join(header) + "\n").encode("utf-8"))
            except Exception:
                pass
    except Exception as e:
        print(f"Warning: failed to write launcher info: {e}")

def main():
    base = os.getcwd()
    print(f"Launcher working directory: {base}")
    print(f"Embedded session datetime: {CURRENT_DATETIME}")
    print(f"Embedded user login: {CURRENT_USER_LOGIN}")

    found = find_script_candidates()
    if "server" not in found and "client" not in found:
        print("Couldn't find server or client scripts. Expected server/server.py and client/client.py (or server.py and client.py).")
        print("Place this launcher in the project root where the server/ and client/ folders are.")
        input("Press Enter to exit...")
        return

    logs_dir = os.path.join(base, "logs")
    ensure_dir(logs_dir)

    # Write launcher info and header into logs
    write_launcher_info(base, logs_dir)

    procs = []

    # Start server first
    if "server" in found:
        server_log = os.path.join(logs_dir, "server.log")
        print(f"Starting server: {found['server']} -> logs: {server_log}")
        p = start_process(found["server"], server_log, use_detach=True)
        procs.append(("server", p))
        # Give server a little time to start
        time.sleep(1.5)
    else:
        print("Server script not found; skipping server start.")

    # Start client next (if present)
    if "client" in found:
        client_log = os.path.join(logs_dir, "client.log")
        print(f"Starting client: {found['client']} -> logs: {client_log}")
        p = start_process(found["client"], client_log, use_detach=True)
        procs.append(("client", p))
    else:
        print("Client script not found; skipping client start.")

    print("Launch commands issued. Server and client (if present) should be running in background.")
    print("Logs directory:", os.path.abspath(logs_dir))
    # Short pause so user sees messages if run double-clicked
    try:
        time.sleep(1.2)
    except:
        pass

if __name__ == "__main__":
    main()
