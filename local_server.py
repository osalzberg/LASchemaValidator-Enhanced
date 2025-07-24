#!/usr/bin/env python3
"""
Simple HTTP server for testing the Azure Log Analytics Schema Validator
"""
import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="webapp", **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    port = 8000
    
    # Try to find an available port
    for test_port in range(8000, 8010):
        try:
            with socketserver.TCPServer(("", test_port), CustomHTTPRequestHandler) as httpd:
                port = test_port
                break
        except OSError:
            continue
    
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Starting server at http://localhost:{port}")
            print("📁 Serving files from: ./webapp")
            print("🔗 Opening browser automatically...")
            print("⚠️  Press Ctrl+C to stop the server")
            
            # Open browser after a short delay
            def open_browser():
                time.sleep(1)
                webbrowser.open(f'http://localhost:{port}')
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
