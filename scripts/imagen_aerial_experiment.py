#!/usr/bin/env python3
"""
Thử Imagen (Gemini API) cho ảnh kiểu flycam / khu công nghiệp.

Lưu ý quan trọng:
- Imagen KHÔNG có tỉ lệ 2:1 (equirectangular 360). Chỉ có tới 16:9.
- Ảnh sinh ra là "ảnh phẳng", không đảm bảo nối seam 360°; đưa vào Three.js
  SphereGeometry như panorama sẽ méo (đặc biệt hai cực).
- Prompt chỉ hỗ trợ tiếng Anh (theo doc Google).
- Ảnh có SynthID watermark (AI-generated).

Tài liệu: https://ai.google.dev/gemini-api/docs/imagen

Chạy:
  pip install google-genai
  export GEMINI_API_KEY="..."
  python3 scripts/imagen_aerial_experiment.py

Tuỳ chọn: PROMPT="your english prompt" python3 ...
"""
from __future__ import annotations

import os
import sys
from pathlib import Path


def main() -> None:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("Thiếu biến môi trường GEMINI_API_KEY.", file=sys.stderr)
        sys.exit(1)

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        print("Cần: pip install google-genai", file=sys.stderr)
        sys.exit(1)

    repo_root = Path(__file__).resolve().parent.parent
    out_dir = repo_root / "panoramas"
    out_dir.mkdir(parents=True, exist_ok=True)

    prompt = os.environ.get(
        "PROMPT",
        "Ultra wide aerial drone photograph of a large industrial park, "
        "rows of factory warehouses, internal roads, green buffer zones, "
        "sunny clear sky, photorealistic, sharp horizon, no text",
    )

    # imagen-4.0-fast-generate-001 rẻ hơn để thử; đổi ultra/standard nếu cần chất lượng.
    model = os.environ.get("IMAGEN_MODEL", "imagen-4.0-fast-generate-001")

    client = genai.Client(api_key=key)
    response = client.models.generate_images(
        model=model,
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="16:9",
            image_size="2K",
        ),
    )

    for i, generated_image in enumerate(response.generated_images):
        path = out_dir / f"gemini_imagen_aerial_experiment_{i}.png"
        path.write_bytes(generated_image.image.image_bytes)
        print("Đã lưu:", path)


if __name__ == "__main__":
    main()
