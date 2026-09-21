import cv2
from pathlib import Path

harvest = Path(r"C:\Users\game\.gemini\threads_harvest")
debug_dir = Path(r"C:\Users\game\.gemini\antigravity\brain\6f46af53-7f44-46a4-83e9-d518ccfc6f9f\flood_subsegments")
debug_dir.mkdir(parents=True, exist_ok=True)

checks = [
    ("threads_stream_vid_08.mp4", [0.5, 3.5, 7.0]),
    ("threads_video_08.mp4", [1.0, 5.0, 10.0, 15.0, 20.0, 25.0]),
    ("threads_stream_vid_07.mp4", [1.0, 6.0, 12.0, 18.0, 22.0]),
    ("threads_video_09.mp4", [1.0, 4.0, 7.0]),
    ("threads_stream_vid_06.mp4", [1.0, 8.0, 16.0, 24.0, 32.0])
]

for clip, pts in checks:
    cap = cv2.VideoCapture(str(harvest / clip))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    for t in pts:
        frame_id = int(t * fps)
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_id)
        ret, frame = cap.read()
        if ret and frame is not None:
            c_tag = clip.split('.')[0]
            out_name = f"{c_tag}_t{int(t*10):03d}.jpg"
            if frame.shape[0] > frame.shape[1]:
                resized = cv2.resize(frame, (360, 640))
            else:
                resized = cv2.resize(frame, (640, 360))
            cv2.imwrite(str(debug_dir / out_name), resized)
            print(f"Saved: {out_name}")
    cap.release()
print("Done!")
