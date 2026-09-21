import urllib.request
import json
import asyncio
import websockets
import base64
from pathlib import Path

async def play_and_snap():
    r = urllib.request.urlopen('http://127.0.0.1:9223/json')
    tabs = json.loads(r.read().decode('utf-8'))
    tab = next(t for t in tabs if '3050' in t.get('url', ''))
    ws_url = tab['webSocketDebuggerUrl']
    async with websockets.connect(ws_url) as ws:
        js = """
        (() => {
            const v = document.querySelector('video');
            v.muted = true;
            v.currentTime = 14.0;
            v.play();
            return { time: v.currentTime, paused: v.paused };
        })()
        """
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res1 = json.loads(await ws.recv())
        print('Play status:', res1['result']['result']['value'])
        
        await asyncio.sleep(1.5)
        
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': 'document.querySelector("video").currentTime', 'returnByValue': True}}))
        res2 = json.loads(await ws.recv())
        print('Time after 1.5s:', res2['result']['result']['value'])
        
        msg = {'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'jpeg', 'quality': 90}}
        await ws.send(json.dumps(msg))
        res3 = json.loads(await ws.recv())
        data = base64.b64decode(res3['result']['data'])
        out_p = Path(r'C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\demo_playing_15s.jpg')
        out_p.write_bytes(data)
        print(f'[+] Saved screenshot at 15s: {out_p.name}')

if __name__ == '__main__':
    asyncio.run(play_and_snap())
