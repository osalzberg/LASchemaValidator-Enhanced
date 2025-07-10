#!/usr/bin/env python3
"""
Simple HTTP server for the Azure Log Analytics Schema Validator webapp
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

def main():
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
