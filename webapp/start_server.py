#!/usr/bin/env python3
"""
🚀 AZURE LOG ANALYTICS SCHEMA VALIDATOR - LOCAL DEVELOPMENT SERVER

OVERVIEW:
This is a simple HTTP server that hosts the Azure Log Analytics Schema Validator
web application locally for development and testing purposes.

WHAT IT DOES FOR YOUR FRIENDS:
Think of this as a "local website launcher" for your validator tool. Instead of
needing to upload files to a web server, this creates a mini web server right
on your computer so you can use the validator offline.

BUSINESS VALUE:
- Enables offline development and testing of Azure schema files
- Provides immediate feedback without internet dependency
- Allows teams to validate schemas before deploying to production
- Creates a professional local development environment

USAGE:
Simply run this script and it will:
1. Start a local web server (usually on http://localhost:8000)
2. Automatically open your web browser to the validator
3. Let you validate Azure Log Analytics schema files locally

TECHNICAL FEATURES:
- Automatic port detection (tries ports 8000-8009)
- Cross-platform browser launching
- Clean shutdown with Ctrl+C
- User-friendly status messages with emojis
- Serves all static files (HTML, CSS, JavaScript)
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def main():
    """
    🌐 MAIN SERVER STARTUP FUNCTION
    This is the core function that sets up and runs the local web server
    
    WHAT IT DOES FOR YOUR FRIENDS:
    This function is like a "digital concierge" that:
    - Finds the best available port on your computer
    - Sets up a mini web server to host your validator
    - Opens your web browser automatically
    - Keeps the server running until you stop it
    
    BUSINESS VALUE:
    Eliminates the complexity of web server setup. Users can run one command
    and immediately start validating their Azure Log Analytics schema files.
    
    TECHNICAL PROCESS:
    1. Navigate to the webapp directory containing all the web files
    2. Try to find an available port (8000-8009) to avoid conflicts
    3. Create an HTTP server that serves static files
    4. Launch the default web browser pointing to the validator
    5. Keep the server running and handle graceful shutdown
    
    ERROR HANDLING:
    - Handles port conflicts by trying multiple ports
    - Gracefully handles browser launch failures
    - Provides clear error messages if no ports are available
    - Supports clean shutdown with Ctrl+C
    """
    # Change to the webapp directory
    webapp_dir = Path(__file__).parent
    os.chdir(webapp_dir)
    
    # Set up server
    PORT = 8000
    Handler = http.server.SimpleHTTPRequestHandler
    
    # Try to find an available port
    for port in range(8000, 8010):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                PORT = port
                print(f"🌐 Azure Log Analytics Schema Validator")
                print(f"📁 Serving files from: {webapp_dir}")
                print(f"🔗 Server running at: http://localhost:{PORT}")
                print(f"📄 Open: http://localhost:{PORT}/index.html")
                print(f"⏹️  Press Ctrl+C to stop the server")
                print("=" * 60)
                
                # Auto-open browser
                try:
                    webbrowser.open(f"http://localhost:{PORT}/index.html")
                    print("🚀 Opening browser automatically...")
                except:
                    print("💡 Please open the URL manually in your browser")
                
                print("=" * 60)
                httpd.serve_forever()
                break
        except OSError:
            continue
    else:
        print("❌ Could not find an available port in range 8000-8009")
        sys.exit(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
