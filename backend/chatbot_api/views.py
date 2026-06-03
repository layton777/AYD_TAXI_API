from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os, requests, json

class ChatbotEndpoint(APIView):
    """Simple proxy to Gemini API.
    Expects JSON payload: {"message": "user text"}
    Returns: {"response": "assistant reply"}
    """
    def post(self, request):
        user_message = request.data.get('message')
        if not user_message:
            return Response({'error': 'No message provided'}, status=status.HTTP_400_BAD_REQUEST)
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            return Response({'error': 'API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": user_message}]}
            ]
        }
        try:
            resp = requests.post(api_url, headers=headers, json=payload, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            ai_text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            return Response({'response': ai_text})
        except requests.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
