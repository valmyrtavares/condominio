import subprocess
import os
from PIL import Image

def generate():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="600" height="200">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&amp;family=Cinzel:wght@700;900&amp;display=swap');

      .zeta-text {
        font-family: 'Times New Roman', 'Playfair Display', Georgia, serif;
        font-size: 84px;
        font-weight: bold;
        fill: #FFFFFF;
        stroke: #222222;
        stroke-width: 2.8px;
        stroke-linejoin: round;
        paint-order: stroke fill;
        letter-spacing: 1px;
        filter: drop-shadow(2px 3px 3px rgba(0, 0, 0, 0.7));
      }

      .zini-text {
        font-family: 'Segoe UI', Arial, -apple-system, sans-serif;
        font-size: 40px;
        font-weight: 800;
        fill: #1a1a1a;
        letter-spacing: -0.5px;
      }
    </style>
    
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1.5" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- LEFT EMBLEM: CIRCULAR BADGE WITH ZINI -->
  <g transform="translate(114, 100)" filter="url(#shadow)">
    <!-- White Circle Base with Green Border -->
    <circle cx="0" cy="0" r="70" fill="#FFFFFF" stroke="#008358" stroke-width="7"/>

    <!-- Green Top Arc Ribbon -->
    <path d="M -52, 0 
             C -54, -38 -15, -54 18, -48 
             C 45, -42 56, -18 42, 6 
             C 32, 22 10, 18 -2, 12
             C -14, 6 -16, -6 -6, -12
             C 4, -18 24, -16 32, -6" 
          fill="none" 
          stroke="#008358" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <!-- Red Bottom Loop Ribbon -->
    <path d="M -24, -38
             C -46, -26 -52, 2 -44, 28
             C -34, 52 -2, 56 22, 48
             C 44, 40 50, 22 36, 10
             C 22, -2 2, 4 -4, 14
             C -10, 24 2, 34 16, 32" 
          fill="none" 
          stroke="#D8232A" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round"/>

    <!-- Zini Text -->
    <text x="0" y="14" text-anchor="middle" class="zini-text">Zini</text>
  </g>

  <!-- MIDDLE ELEMENT: ITALIAN FLAG FLUTTER RIBBONS -->
  <g transform="translate(242, 100)" filter="url(#shadow)">
    <!-- Green Wave (Left) -->
    <path d="M -7, -54
             C 4, -34 4, -14 -6, 4
             C -16, 22 -14, 42 -3, 58
             C -7, 58 -14, 40 -14, 20
             C -14, 0 -3, -22 -12, -44
             C -14, -50 -10, -54 -7, -54 Z"
          fill="#008358" 
          stroke="#006342" 
          stroke-width="0.6"/>

    <!-- Red Wave (Right) -->
    <path d="M 4, -52
             C 15, -32 15, -12 5, 6
             C -5, 24 -3, 44 8, 60
             C 4, 60 -3, 42 -3, 22
             C -3, 2 8, -20 -1, -42
             C -3, -48 1, -52 4, -52 Z"
          fill="#D8232A" 
          stroke="#AB1A20" 
          stroke-width="0.6"/>
  </g>

  <!-- RIGHT TEXT: ZETA2 -->
  <g transform="translate(280, 128)">
    <text x="0" y="0" class="zeta-text">ZETA2</text>
  </g>
</svg>
"""

    svg_path = r"c:\Codigo\Condominio\public\logos\logo_zini_zeta2.svg"
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 600px;
    height: 200px;
    background: transparent !important;
    overflow: hidden;
  }}
  .container {{
    width: 600px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
</style>
</head>
<body>
  <div class="container">
    {svg_content}
  </div>
</body>
</html>
"""
    html_path = r"c:\Codigo\Condominio\public\logos\render_logo.html"
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    png_path_600 = r"c:\Codigo\Condominio\public\logos\logo_zini_zeta2_600x200.png"
    png_public = r"c:\Codigo\Condominio\public\logo_zini_zeta2.png"

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--default-background-color=00000000",
        f"--screenshot={png_path_600}",
        "--window-size=600,200",
        "--hide-scrollbars",
        "file:///" + html_path.replace("\\", "/")
    ]
    subprocess.run(cmd, capture_output=True, text=True)

    if os.path.exists(png_path_600):
        im = Image.open(png_path_600)
        im.save(png_public)
        print(f"600x200 OK: {png_public}")

    # 1200x400 @2x
    html_2x = html_content.replace('width: 600px; height: 200px;', 'width: 1200px; height: 400px;')
    html_2x = html_2x.replace('width="600" height="200"', 'width="1200" height="400"')
    html_2x_path = r"c:\Codigo\Condominio\public\logos\render_logo_2x.html"
    with open(html_2x_path, "w", encoding="utf-8") as f:
        f.write(html_2x)

    png_path_1200 = r"c:\Codigo\Condominio\public\logos\logo_zini_zeta2_1200x400.png"
    cmd_2x = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--default-background-color=00000000",
        f"--screenshot={png_path_1200}",
        "--window-size=1200,400",
        "--hide-scrollbars",
        "file:///" + html_2x_path.replace("\\", "/")
    ]
    subprocess.run(cmd_2x, capture_output=True, text=True)
    if os.path.exists(png_path_1200):
        print(f"1200x400 OK: {png_path_1200}")

if __name__ == "__main__":
    generate()
