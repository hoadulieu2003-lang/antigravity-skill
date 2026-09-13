' =============================================================================
' Antigravity Autonomous Learning Pulse - Silent VBScript Wrapper
' Ensures anti_learning_loop.py runs completely in the background without
' flashing any console or command prompt windows on Anh's screen.
' =============================================================================
Dim WshShell, scriptPath, command
Set WshShell = CreateObject("WScript.Shell")
scriptPath = "C:\Users\game\.gemini\config\scripts\anti_learning_loop.py"
command = "python """ & scriptPath & """"
' WindowStyle = 0 (Hidden), bWaitOnReturn = False (Asynchronous background)
WshShell.Run command, 0, False
Set WshShell = Nothing
