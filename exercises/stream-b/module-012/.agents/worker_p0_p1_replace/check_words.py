import re

with open("C:/Users/game/.gemini/exercises/stream-b/module-012/BRAND_THESIS.md", "r", encoding="utf-8") as f:
    text = f.read()

# Let's match exact quote between *" and "*
matches = re.findall(r'> \*"([^*]+)"\*', text)
for i, m in enumerate(matches):
    words = len(m.split())
    print(f"Thesis {i+1} word count: {words}")
