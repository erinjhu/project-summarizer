#!/usr/bin/env python3
"""
Utility script to check Google Gemini API quota and provide guidance on rate limiting issues.
"""

import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def check_gemini_api_status():
    """
    Check the current status of Gemini API and provide guidance.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("Please set your API key in the .env file")
        return
    
    print("🔍 Checking Gemini API status...")
    print(f"API Key: {api_key[:10]}...{api_key[-4:] if len(api_key) > 14 else '***'}")
    
    # Test API call
    try:
        from google import genai
        client = genai.Client()
        
        # Simple test request
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Hello, this is a test request."
        )
        
        print("✅ API is working correctly!")
        print(f"Response: {response.text}")
        
    except Exception as e:
        error_message = str(e)
        print(f"❌ API Error: {error_message}")
        
        if "RATE_LIMIT_EXCEEDED" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            print("\n🚨 RATE LIMIT EXCEEDED")
            print("Your API quota has been exceeded. Here are the solutions:")
            print("\n1. Wait and retry:")
            print("   - Wait 1-2 minutes before making another request")
            print("   - The rate limit resets every minute")
            
            print("\n2. Request quota increase:")
            print("   - Go to: https://cloud.google.com/docs/quotas/help/request_increase")
            print("   - Select 'Generative Language API'")
            print("   - Request higher limits for 'GenerateContentRequestsPerMinutePerProjectPerRegion'")
            
            print("\n3. Check your current quota:")
            print("   - Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas")
            print("   - Look for 'GenerateContentRequestsPerMinutePerProjectPerRegion'")
            
        elif "QUOTA_EXCEEDED" in error_message:
            print("\n🚨 QUOTA EXCEEDED")
            print("Your daily/monthly quota has been exceeded.")
            print("Solutions:")
            print("1. Wait until quota resets (usually daily)")
            print("2. Request quota increase from Google Cloud Console")
            print("3. Consider upgrading your billing plan")
            
        else:
            print("\n🔧 General API Error")
            print("This might be a temporary issue or configuration problem.")
            print("Check your API key and network connection.")

def get_quota_guidance():
    """
    Provide general guidance on managing API quotas.
    """
    print("\n📋 QUOTA MANAGEMENT GUIDELINES")
    print("=" * 50)
    
    print("\n1. Current Limits (Free Tier):")
    print("   - 15 requests per minute per project per region")
    print("   - 1,500 requests per day")
    
    print("\n2. Best Practices:")
    print("   - Implement exponential backoff in your code")
    print("   - Add delays between requests")
    print("   - Cache responses when possible")
    print("   - Monitor your usage in Google Cloud Console")
    
    print("\n3. Rate Limiting Implementation:")
    print("   - Use the updated gemini_utils.py with retry logic")
    print("   - Add delays between consecutive requests")
    print("   - Handle 429 (Too Many Requests) errors gracefully")
    
    print("\n4. Monitoring:")
    print("   - Check usage at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas")
    print("   - Set up alerts for quota usage")
    print("   - Monitor error rates in your application logs")

def main():
    print("🔧 Gemini API Quota Checker")
    print("=" * 40)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    check_gemini_api_status()
    get_quota_guidance()
    
    print("\n" + "=" * 40)
    print("✅ Check complete!")

if __name__ == "__main__":
    main() 