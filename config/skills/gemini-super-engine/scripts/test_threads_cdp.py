import urllib.request
import json

resp = urllib.request.urlopen('http://127.0.0.1:9223/json')
tabs = json.loads(resp.read().decode('utf-8'))
for t in tabs:
    title = t.get('title', '')
    if 'Threads' in title:
        print(f"Threads Tab: {t.get('id')}")
        print(f"URL: {t.get('url')}")
        print(f"WS URL: {t.get('webSocketDebuggerUrl')}")
