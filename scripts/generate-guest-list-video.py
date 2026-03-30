#!/usr/bin/env python3
"""Generate wedding guest list demo video using Pillow + ffmpeg."""

import os
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont

# --- Config ---
WIDTH, HEIGHT = 1920, 1080
FPS = 24
SECONDS_PER_SLIDE = 6
TOTAL_FRAMES = FPS * SECONDS_PER_SLIDE * 5  # 5 slides

PINK = "#ec4899"
TEAL = "#14b8a6"
WHITE = "#ffffff"
DARK = "#1e293b"
LIGHT_BG = "#f8fafc"
LIGHT_PINK = "#fdf2f8"
LIGHT_TEAL = "#f0fdfa"

OUTPUT_PATH = "/Users/openclaw/.openclaw/workspace-philly/wedding-site/public/videos/wedding-guest-list-demo.mp4"

# --- Fonts ---
def load_font(size, bold=False):
    """Load a system font at the given size."""
    candidates = [
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Geneva.ttf",
        "/Library/Fonts/Arial Unicode.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def text_center_x(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    return (WIDTH - tw) // 2


def draw_top_bar(draw):
    """Draw a thin gradient-like accent bar at the top."""
    for x in range(WIDTH):
        ratio = x / WIDTH
        r = int(236 * (1 - ratio) + 20 * ratio)
        g = int(72 * (1 - ratio) + 184 * ratio)
        b = int(153 * (1 - ratio) + 166 * ratio)
        draw.line([(x, 0), (x, 6)], fill=(r, g, b))


def draw_bottom_bar(draw):
    """Small branding bar at bottom."""
    draw.rectangle([(0, HEIGHT - 40), (WIDTH, HEIGHT)], fill=DARK)
    font_sm = load_font(18)
    draw.text((WIDTH // 2 - 120, HEIGHT - 34), "startweddingplanning.com", fill="#94a3b8", font=font_sm)


# --- Slide Generators ---

def slide_title():
    img = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw)
    draw_bottom_bar(draw)

    # Large title
    font_big = load_font(72)
    font_sub = load_font(32)

    title = "How to Trim Your"
    title2 = "Wedding Guest List"
    subtitle = "A practical guide to making the tough cuts"

    x1 = text_center_x(draw, title, font_big)
    x2 = text_center_x(draw, title2, font_big)
    xs = text_center_x(draw, subtitle, font_sub)

    draw.text((x1, 340), title, fill=DARK, font=font_big)
    draw.text((x2, 430), title2, fill=PINK, font=font_big)

    # Decorative line
    draw.rectangle([(WIDTH // 2 - 60, 530), (WIDTH // 2 + 60, 534)], fill=TEAL)

    draw.text((xs, 560), subtitle, fill="#64748b", font=font_sub)

    # Small icon-like circles
    for i, color in enumerate([PINK, TEAL, PINK]):
        cx = WIDTH // 2 - 50 + i * 50
        draw.ellipse([(cx - 8, 640), (cx + 8, 656)], fill=color)

    return img


def slide_stats():
    img = Image.new("RGB", (WIDTH, HEIGHT), LIGHT_PINK)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw)
    draw_bottom_bar(draw)

    font_heading = load_font(56)
    font_big_num = load_font(80)
    font_body = load_font(34)
    font_label = load_font(26)

    heading = "The Cost of Every Guest"
    xh = text_center_x(draw, heading, font_heading)
    draw.text((xh, 120), heading, fill=DARK, font=font_heading)

    # Decorative line
    draw.rectangle([(WIDTH // 2 - 50, 200), (WIDTH // 2 + 50, 204)], fill=TEAL)

    # Left stat card
    card_w, card_h = 620, 340
    lx, ly = WIDTH // 2 - card_w - 40, 270
    draw.rounded_rectangle([(lx, ly), (lx + card_w, ly + card_h)], radius=20, fill=WHITE, outline="#e2e8f0")
    draw.rounded_rectangle([(lx, ly), (lx + card_w, ly + 8)], radius=0, fill=PINK)

    num1 = "$150 - $350"
    xn1 = lx + (card_w - draw.textbbox((0, 0), num1, font=font_big_num)[2]) // 2
    draw.text((xn1, ly + 60), num1, fill=PINK, font=font_big_num)
    label1 = "Average cost per guest"
    xl1 = lx + (card_w - draw.textbbox((0, 0), label1, font=font_body)[2]) // 2
    draw.text((xl1, ly + 170), label1, fill="#64748b", font=font_body)
    sub1 = "Food, drinks, favours, seating"
    xs1 = lx + (card_w - draw.textbbox((0, 0), sub1, font=font_label)[2]) // 2
    draw.text((xs1, ly + 230), sub1, fill="#94a3b8", font=font_label)

    # Right stat card
    rx, ry = WIDTH // 2 + 40, 270
    draw.rounded_rectangle([(rx, ry), (rx + card_w, ry + card_h)], radius=20, fill=WHITE, outline="#e2e8f0")
    draw.rounded_rectangle([(rx, ry), (rx + card_w, ry + 8)], radius=0, fill=TEAL)

    num2 = "$3,000 - $7,000"
    xn2 = rx + (card_w - draw.textbbox((0, 0), num2, font=font_big_num)[2]) // 2
    draw.text((xn2, ry + 60), num2, fill=TEAL, font=font_big_num)
    label2 = "Saved by cutting 20 guests"
    xl2 = rx + (card_w - draw.textbbox((0, 0), label2, font=font_body)[2]) // 2
    draw.text((xl2, ry + 170), label2, fill="#64748b", font=font_body)
    sub2 = "That's a honeymoon upgrade!"
    xs2 = rx + (card_w - draw.textbbox((0, 0), sub2, font=font_label)[2]) // 2
    draw.text((xs2, ry + 230), sub2, fill="#94a3b8", font=font_label)

    # Bottom note
    note = load_font(28)
    note_text = "Every guest you cut directly reduces your biggest expenses."
    xn = text_center_x(draw, note_text, note)
    draw.text((xn, 680), note_text, fill=DARK, font=note)

    return img


def slide_framework():
    img = Image.new("RGB", (WIDTH, HEIGHT), LIGHT_TEAL)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw)
    draw_bottom_bar(draw)

    font_heading = load_font(56)
    font_tier = load_font(44)
    font_body = load_font(26)
    font_label = load_font(22)

    heading = "The A-List / B-List / C-List System"
    xh = text_center_x(draw, heading, font_heading)
    draw.text((xh, 100), heading, fill=DARK, font=font_heading)
    draw.rectangle([(WIDTH // 2 - 50, 180), (WIDTH // 2 + 50, 184)], fill=PINK)

    tiers = [
        ("A-List", PINK, "Must-Have Guests",
         ["Immediate family", "Best friends", "Wedding party",
          "People you can't imagine the day without"]),
        ("B-List", TEAL, "Important But Flexible",
         ["Extended family", "Good friends", "Close colleagues",
          "Invite as A-List declines come in"]),
        ("C-List", "#64748b", "Nice-to-Have",
         ["Acquaintances", "Distant relatives", "Plus-ones you're unsure about",
          "Consider for a larger celebration"]),
    ]

    card_w = 520
    start_x = (WIDTH - 3 * card_w - 2 * 40) // 2
    for i, (name, color, subtitle, items) in enumerate(tiers):
        x = start_x + i * (card_w + 40)
        y = 230

        # Card background
        draw.rounded_rectangle([(x, y), (x + card_w, y + 520)], radius=16, fill=WHITE, outline="#e2e8f0")
        # Color header bar
        draw.rounded_rectangle([(x, y), (x + card_w, y + 80)], radius=16, fill=color)
        draw.rectangle([(x, y + 40), (x + card_w, y + 80)], fill=color)

        # Tier name
        xn = x + (card_w - draw.textbbox((0, 0), name, font=font_tier)[2]) // 2
        draw.text((xn, y + 16), name, fill=WHITE, font=font_tier)

        # Subtitle
        xs = x + (card_w - draw.textbbox((0, 0), subtitle, font=font_body)[2]) // 2
        draw.text((xs, y + 100), subtitle, fill=color, font=font_body)

        # Divider
        draw.rectangle([(x + 40, y + 145), (x + card_w - 40, y + 147)], fill="#e2e8f0")

        # Items
        for j, item in enumerate(items):
            bullet_y = y + 170 + j * 55
            draw.ellipse([(x + 40, bullet_y + 6), (x + 52, bullet_y + 18)], fill=color)
            draw.text((x + 65, bullet_y), item, fill=DARK, font=font_label)

    # Bottom note
    note_font = load_font(26)
    note = "Start with your A-List, then add B-List as space and budget allow."
    xn = text_center_x(draw, note, note_font)
    draw.text((xn, 800), note, fill="#475569", font=note_font)

    return img


def slide_rules():
    img = Image.new("RGB", (WIDTH, HEIGHT), WHITE)
    draw = ImageDraw.Draw(img)
    draw_top_bar(draw)
    draw_bottom_bar(draw)

    font_heading = load_font(52)
    font_rule = load_font(30)
    font_num = load_font(36)

    heading = "7 Rules for Trimming Your Guest List"
    xh = text_center_x(draw, heading, font_heading)
    draw.text((xh, 80), heading, fill=DARK, font=font_heading)
    draw.rectangle([(WIDTH // 2 - 50, 155), (WIDTH // 2 + 50, 159)], fill=TEAL)

    rules = [
        "Set a firm number before you start listing names",
        "Apply the 'no ring, no bring' rule for plus-ones",
        "Skip coworkers you wouldn't see outside of work",
        "Children: pick an age cutoff and stick to it",
        "Haven't spoken in 2+ years? They don't make the cut",
        "Don't invite out of obligation or guilt",
        "Both partners get equal say on their side",
    ]

    # Two columns
    col_w = 760
    col1_x = WIDTH // 2 - col_w - 30
    col2_x = WIDTH // 2 + 30
    colors = [PINK, TEAL]

    for i, rule in enumerate(rules):
        col_x = col1_x if i < 4 else col2_x
        row = i if i < 4 else i - 4
        y = 210 + row * 140

        # Number circle
        color = colors[i % 2]
        cx, cy = col_x + 30, y + 20
        draw.ellipse([(cx - 24, cy - 24), (cx + 24, cy + 24)], fill=color)
        num_str = str(i + 1)
        xn = cx - draw.textbbox((0, 0), num_str, font=font_num)[2] // 2
        draw.text((xn, cy - 18), num_str, fill=WHITE, font=font_num)

        # Rule text (wrap if needed)
        draw.text((col_x + 70, y - 2), rule, fill=DARK, font=font_rule)

        # Subtle underline
        draw.rectangle([(col_x + 70, y + 50), (col_x + col_w - 20, y + 51)], fill="#e2e8f0")

    # Bottom tip
    tip_font = load_font(26)
    tip = "Remember: A smaller wedding means more quality time with each guest."
    xt = text_center_x(draw, tip, tip_font)
    draw.text((xt, 800), tip, fill="#64748b", font=tip_font)

    return img


def slide_cta():
    img = Image.new("RGB", (WIDTH, HEIGHT), DARK)
    draw = ImageDraw.Draw(img)

    # Top accent bar (pink to teal gradient)
    for x in range(WIDTH):
        ratio = x / WIDTH
        r = int(236 * (1 - ratio) + 20 * ratio)
        g = int(72 * (1 - ratio) + 184 * ratio)
        b = int(153 * (1 - ratio) + 166 * ratio)
        draw.line([(x, 0), (x, 8)], fill=(r, g, b))

    font_big = load_font(64)
    font_sub = load_font(36)
    font_url = load_font(42)
    font_sm = load_font(24)

    # Main CTA
    cta1 = "Get Your Free"
    cta2 = "Guest List Template"
    x1 = text_center_x(draw, cta1, font_big)
    x2 = text_center_x(draw, cta2, font_big)
    draw.text((x1, 280), cta1, fill=WHITE, font=font_big)
    draw.text((x2, 370), cta2, fill=PINK, font=font_big)

    # Decorative line
    draw.rectangle([(WIDTH // 2 - 60, 470), (WIDTH // 2 + 60, 474)], fill=TEAL)

    # Subtitle
    sub = "Downloadable spreadsheet with A/B/C tier tracking"
    xs = text_center_x(draw, sub, font_sub)
    draw.text((xs, 510), sub, fill="#94a3b8", font=font_sub)

    # Button-like element
    btn_text = "startweddingplanning.com"
    btn_w = draw.textbbox((0, 0), btn_text, font=font_url)[2] + 80
    btn_h = 70
    bx = (WIDTH - btn_w) // 2
    by = 620
    draw.rounded_rectangle([(bx, by), (bx + btn_w, by + btn_h)], radius=35, fill=TEAL)
    xt = bx + (btn_w - draw.textbbox((0, 0), btn_text, font=font_url)[2]) // 2
    draw.text((xt, by + 12), btn_text, fill=WHITE, font=font_url)

    # Bottom note
    note = "Plan smarter. Spend less. Celebrate more."
    xn = text_center_x(draw, note, font_sm)
    draw.text((xn, 750), note, fill="#64748b", font=font_sm)

    # Bottom gradient bar
    for x in range(WIDTH):
        ratio = x / WIDTH
        r = int(20 * (1 - ratio) + 236 * ratio)
        g = int(184 * (1 - ratio) + 72 * ratio)
        b = int(166 * (1 - ratio) + 153 * ratio)
        draw.line([(x, HEIGHT - 8), (x, HEIGHT)], fill=(r, g, b))

    return img


def add_fade(slide_img, next_img, frame_in_transition, transition_frames):
    """Crossfade between two slides."""
    alpha = frame_in_transition / transition_frames
    return Image.blend(slide_img, next_img, alpha)


def main():
    print("Generating slides...")
    slides = [slide_title(), slide_stats(), slide_framework(), slide_rules(), slide_cta()]

    frames_per_slide = FPS * SECONDS_PER_SLIDE  # 144 frames
    transition_frames = int(FPS * 0.5)  # 12 frames for crossfade

    with tempfile.TemporaryDirectory() as tmpdir:
        frame_num = 0
        total_slides = len(slides)

        for s_idx in range(total_slides):
            current = slides[s_idx]
            next_slide = slides[s_idx + 1] if s_idx < total_slides - 1 else None

            # Static portion (minus transition at end)
            static_frames = frames_per_slide - (transition_frames if next_slide else 0)

            for _ in range(static_frames):
                path = os.path.join(tmpdir, f"frame_{frame_num:05d}.png")
                current.save(path)
                frame_num += 1

            # Crossfade transition
            if next_slide:
                for t in range(transition_frames):
                    blended = add_fade(current, next_slide, t, transition_frames)
                    path = os.path.join(tmpdir, f"frame_{frame_num:05d}.png")
                    blended.save(path)
                    frame_num += 1

        print(f"Generated {frame_num} frames. Encoding video with ffmpeg...")

        # Ensure output directory exists
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)

        cmd = [
            "ffmpeg", "-y",
            "-framerate", str(FPS),
            "-i", os.path.join(tmpdir, "frame_%05d.png"),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "medium",
            "-crf", "23",
            "-movflags", "+faststart",
            OUTPUT_PATH,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print("ffmpeg stderr:", result.stderr)
            raise RuntimeError("ffmpeg failed")

        size_mb = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
        print(f"Video saved to: {OUTPUT_PATH}")
        print(f"File size: {size_mb:.2f} MB")
        print("Done!")


if __name__ == "__main__":
    main()
