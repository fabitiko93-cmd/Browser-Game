"""CPU review only: project the runtime panorama behind a transparent Blender
review. This verifies composition, not WebGL shaders, controls or performance.
Usage: python scripts/composite-planet-sky.py artifacts/landscapes 1
"""
import json, sys, math
from pathlib import Path
import numpy as np
from PIL import Image

root, num = Path(sys.argv[1]), sys.argv[2]
recipe = json.loads((root / f'region-{num}.json').read_text())
foreground = Image.open(root / f'region-{num}.png').convert('RGBA')
width, height = foreground.size
sky = recipe['sky']
photo = np.asarray(Image.open(Path('web/models/planets') / sky['file']).convert('RGB'), dtype=float)
forward = np.array(recipe['target']) - np.array(recipe['camera']); forward /= np.linalg.norm(forward)
right = np.cross(forward, [0, 1, 0]); right /= np.linalg.norm(right)
up = np.cross(right, forward)
x, y = np.meshgrid((np.arange(width) + .5) / width * 2 - 1, 1 - (np.arange(height) + .5) / height * 2)
spread = math.tan(math.radians(recipe['fov']) / 2)
direction = forward + right * x[:, :, None] * spread * width / height + up * y[:, :, None] * spread
direction /= np.linalg.norm(direction, axis=2)[:, :, None]
u = ((np.arctan2(direction[:, :, 2], direction[:, :, 0]) - sky['yaw']) / (2 * math.pi) + .5) % 1
v = np.arcsin(direction[:, :, 1]) / math.pi + .5
px = u * photo.shape[1] - .5; py = np.clip((1 - v) * photo.shape[0] - .5, 0, photo.shape[0] - 1.001)
ix, iy = np.floor(px).astype(int), np.floor(py).astype(int); fx, fy = (px - ix)[:, :, None], (py - iy)[:, :, None]
sample = (photo[iy, ix % photo.shape[1]] * (1 - fx) + photo[iy, (ix + 1) % photo.shape[1]] * fx) * (1 - fy) + (photo[iy + 1, ix % photo.shape[1]] * (1 - fx) + photo[iy + 1, (ix + 1) % photo.shape[1]] * fx) * fy
background = Image.fromarray(np.uint8(np.clip(sample, 0, 255))).convert('RGBA')
background.alpha_composite(foreground)
background.convert('RGB').save(root / f'region-{num}-sky.jpg', quality=93)
