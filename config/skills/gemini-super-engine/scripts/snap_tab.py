import urllib.request
import json
import asyncio
import websockets
import base64
from pathlib import Path

async def snap_at_14s():
    r = urllib.request.urlopen('http://127.0.0.1:9223/json')
    tabs = json.loads(r.read().decode('utf-8'))
    tab = next(t for t in tabs if '3050' in t.get('url', ''))
    ws_url = tab['webSocketDebuggerUrl']
    async with websockets.connect(ws_url) as ws:
        await asyncio.sleep(1.0)
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': 'window.scrollTo(0, 480);'}}))
        await ws.recv()
        await ws.send(json.dumps({'id': 2, 'method': 'Runtime.evaluate', 'params': {'expression': 'document.querySelector("video").currentTime = 14;'}}))
        await ws.recv()
        await asyncio.sleep(1.5)
        msg = {'id': 3, 'method': 'Page.captureScreenshot', 'params': {'format': 'jpeg', 'quality': 90}}
        await ws.send(json.dumps(msg))
        res = json.loads(await ws.recv())
        data = base64.b64decode(res['result']['data'])
        out_p = Path(r'C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\demo_fixed_14s.jpg')
        out_p.write_bytes(data)
        print(f'[+] Saved screenshot at 14s: {out_p.name}')

if __name__ == '__main__':
    asyncio.run(snap_at_14s())
