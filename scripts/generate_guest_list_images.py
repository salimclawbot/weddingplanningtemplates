#!/usr/bin/env python3
"""Generate 9 professional wedding guest list article images using PIL/Pillow."""

import os
from PIL import Image, ImageDraw, ImageFont

# === CONFIG ===
OUT = "/Users/openclaw/.openclaw/workspace-philly/wedding-site/public/images/articles"
PINK = (236, 72, 153)
TEAL = (20, 184, 166)
WHITE = (255, 255, 255)
DARK = (30, 41, 59)
LIGHT_PINK = (253, 242, 248)
LIGHT_TEAL = (240, 253, 250)
GREY = (148, 163, 184)
LIGHT_GREY = (241, 245, 249)
DARK_GREY = (71, 85, 105)
GOLD = (234, 179, 8)

# Load fonts
def load_font(size, bold=False, index=None):
    paths = [
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in paths:
        try:
            # HelveticaNeue.ttc: 0=Regular, 1=Italic, 4=Medium, 8=Bold, 10=Light
            if bold:
                idx = index if index is not None else 8
            else:
                idx = index if index is not None else 0
            return ImageFont.truetype(p, size, index=idx)
        except Exception:
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def font_light(size):
    return load_font(size, index=10)

def font_regular(size):
    return load_font(size, index=0)

def font_medium(size):
    return load_font(size, index=4)

def font_bold(size):
    return load_font(size, bold=True, index=8)


# === HELPERS ===

def gradient_h(draw, x0, y0, x1, y1, c1, c2):
    """Horizontal gradient fill."""
    w = x1 - x0
    for i in range(w):
        t = i / max(w - 1, 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(x0 + i, y0), (x0 + i, y1)], fill=(r, g, b))

def gradient_v(draw, x0, y0, x1, y1, c1, c2):
    """Vertical gradient fill."""
    h = y1 - y0
    for i in range(h):
        t = i / max(h - 1, 1)
        r = int(c1[0] + (c2[0] - c1[0]) * t)
        g = int(c1[1] + (c2[1] - c1[1]) * t)
        b = int(c1[2] + (c2[2] - c1[2]) * t)
        draw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))

def gradient_diag(img, c1, c2):
    """Diagonal gradient on full image."""
    w, h = img.size
    draw = ImageDraw.Draw(img)
    for y in range(h):
        for x in range(0, w, 2):  # step 2 for speed
            t = (x / w * 0.5 + y / h * 0.5)
            r = int(c1[0] + (c2[0] - c1[0]) * t)
            g = int(c1[1] + (c2[1] - c1[1]) * t)
            b = int(c1[2] + (c2[2] - c1[2]) * t)
            draw.line([(x, y), (x + 1, y)], fill=(r, g, b))

def rounded_rect(draw, xy, fill, radius=20, outline=None, width=0):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_circle(draw, cx, cy, r, fill):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)

def draw_diamond(draw, cx, cy, size, fill):
    draw.polygon([(cx, cy - size), (cx + size, cy), (cx, cy + size), (cx - size, cy)], fill=fill)

def draw_arrow(draw, x1, y1, x2, y2, fill, width=3):
    draw.line([(x1, y1), (x2, y2)], fill=fill, width=width)
    # arrowhead
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    sz = 12
    ax = x2 - sz * math.cos(angle - 0.4)
    ay = y2 - sz * math.sin(angle - 0.4)
    bx = x2 - sz * math.cos(angle + 0.4)
    by = y2 - sz * math.sin(angle + 0.4)
    draw.polygon([(x2, y2), (int(ax), int(ay)), (int(bx), int(by))], fill=fill)

def text_center(draw, text, y, font, fill, width):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (width - tw) // 2
    draw.text((x, y), text, font=font, fill=fill)

def text_center_xy(draw, text, cx, cy, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2), text, font=font, fill=fill)

def add_decorative_dots(draw, w, h, color, count=30, size=4):
    import random
    random.seed(42)
    for _ in range(count):
        x = random.randint(0, w)
        y = random.randint(0, h)
        a = random.randint(40, 120)
        c = (color[0], color[1], color[2])
        draw_circle(draw, x, y, size, c)

def add_corner_decorations(draw, w, h):
    """Add elegant corner decorations."""
    # Top-left arc cluster
    for i in range(3):
        r = 60 + i * 30
        draw.arc([-r, -r, r, r], 0, 90, fill=(*WHITE, 40), width=2)
    # Bottom-right arc cluster
    for i in range(3):
        r = 60 + i * 30
        draw.arc([w - r, h - r, w + r, h + r], 180, 270, fill=(*WHITE, 40), width=2)

def draw_separator(draw, y, w, color=PINK, margin=100):
    """Elegant horizontal separator."""
    mid = w // 2
    draw.line([(margin, y), (mid - 30, y)], fill=color, width=2)
    draw_diamond(draw, mid, y, 6, color)
    draw.line([(mid + 30, y), (w - margin, y)], fill=color, width=2)

def save(img, name):
    path = os.path.join(OUT, name)
    img.save(path, "JPEG", quality=90)
    print(f"  Saved: {path}")


# =====================================================================
# IMAGE 1: Hero
# =====================================================================
def make_hero():
    print("1. Hero image...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)
    gradient_h(draw, 0, 0, W, H, PINK, TEAL)

    # Overlay subtle pattern - diagonal lines
    for i in range(-H, W + H, 40):
        draw.line([(i, 0), (i + H, H)], fill=(255, 255, 255, 15), width=1)

    # Central card
    cx, cy = W // 2, H // 2
    card_w, card_h = 1200, 600
    rounded_rect(draw, (cx - card_w//2, cy - card_h//2, cx + card_w//2, cy + card_h//2),
                 fill=(255, 255, 255), radius=30)
    # Inner shadow border
    rounded_rect(draw, (cx - card_w//2 + 4, cy - card_h//2 + 4, cx + card_w//2 - 4, cy + card_h//2 - 4),
                 fill=None, radius=28, outline=(236, 72, 153, 30), width=2)

    # Decorative top bar on card
    gradient_h(draw, cx - card_w//2 + 30, cy - card_h//2 + 20, cx + card_w//2 - 30, cy - card_h//2 + 26, PINK, TEAL)

    # Ring icon
    ring_y = cy - 180
    draw_circle(draw, cx - 20, ring_y, 25, None)
    draw.ellipse([cx - 45, ring_y - 25, cx + 5, ring_y + 25], outline=PINK, width=3)
    draw.ellipse([cx - 5, ring_y - 25, cx + 45, ring_y + 25], outline=TEAL, width=3)

    # Title
    f_title = font_bold(62)
    text_center(draw, "Wedding Guest List Management", cy - 110, f_title, DARK, W)

    # Separator
    draw_separator(draw, cy - 30, W, PINK)

    # Subtitle
    f_sub = font_light(38)
    text_center(draw, "How to Trim It Down Without the Guilt", cy + 20, f_sub, DARK_GREY, W)

    # Bottom tag
    f_tag = font_medium(22)
    tag_y = cy + 120
    # Tag pill
    tag_text = "openclaw.com.au  |  2026 Planning Guide"
    bbox = draw.textbbox((0, 0), tag_text, font=f_tag)
    tw = bbox[2] - bbox[0]
    rounded_rect(draw, (cx - tw//2 - 30, tag_y - 8, cx + tw//2 + 30, tag_y + 38),
                 fill=LIGHT_PINK, radius=20)
    text_center(draw, tag_text, tag_y, f_tag, PINK, W)

    # Corner decorations outside card
    for offset in [(80, 80), (W - 80, 80), (80, H - 80), (W - 80, H - 80)]:
        draw_diamond(draw, offset[0], offset[1], 12, WHITE)

    save(img, "wedding-guest-list-hero.jpg")


# =====================================================================
# IMAGE 2: Couple Reviewing
# =====================================================================
def make_couple_reviewing():
    print("2. Couple reviewing...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Background - soft gradient
    gradient_v(draw, 0, 0, W, H, LIGHT_PINK, WHITE)

    # Left decorative bar
    gradient_v(draw, 0, 0, 12, H, PINK, TEAL)

    # Main card
    mx, my = W // 2, H // 2
    rounded_rect(draw, (120, 80, W - 120, H - 80), fill=WHITE, radius=24, outline=(226, 232, 240), width=2)

    # Step badge
    badge_x, badge_y = 200, 140
    draw_circle(draw, badge_x, badge_y + 30, 40, PINK)
    f_step_num = font_bold(36)
    text_center_xy(draw, "1", badge_x, badge_y + 30, f_step_num, WHITE)

    f_step_label = font_medium(20)
    draw.text((badge_x + 55, badge_y + 8), "STEP ONE", font=f_step_label, fill=PINK)
    f_title = font_bold(48)
    draw.text((badge_x + 55, badge_y + 34), "Review Together", font=f_title, fill=DARK)

    # Separator
    draw.line([(180, 230), (W - 180, 230)], fill=(226, 232, 240), width=2)

    # Two-column layout
    col1_x = 200
    col2_x = W // 2 + 60
    top_y = 280

    # Column 1: Key principles
    f_heading = font_bold(28)
    f_body = font_regular(22)

    draw.text((col1_x, top_y), "Key Principles", font=f_heading, fill=TEAL)

    principles = [
        "Start with separate lists",
        "Identify overlapping names",
        "Set a budget-based cap",
        "Prioritize close relationships",
        "Consider venue capacity",
    ]
    for i, p in enumerate(principles):
        y = top_y + 55 + i * 55
        # Checkmark circle
        draw_circle(draw, col1_x + 15, y + 12, 14, TEAL)
        f_check = font_bold(18)
        text_center_xy(draw, "✓", col1_x + 15, y + 12, f_check, WHITE)
        draw.text((col1_x + 42, y), p, font=f_body, fill=DARK)

    # Column 2: Visual card - couple icon area
    card_x = col2_x
    card_y = top_y
    card_w2 = W - 180 - col2_x
    card_h2 = 420

    rounded_rect(draw, (card_x, card_y, card_x + card_w2, card_y + card_h2),
                 fill=LIGHT_TEAL, radius=20)

    # Stylized "couple" with two circles + body shapes
    couple_cx = card_x + card_w2 // 2
    couple_cy = card_y + 140
    # Person 1
    draw_circle(draw, couple_cx - 60, couple_cy - 40, 35, PINK)
    rounded_rect(draw, (couple_cx - 90, couple_cy + 5, couple_cx - 30, couple_cy + 80),
                 fill=PINK, radius=15)
    # Person 2
    draw_circle(draw, couple_cx + 60, couple_cy - 40, 35, TEAL)
    rounded_rect(draw, (couple_cx + 30, couple_cy + 5, couple_cx + 90, couple_cy + 80),
                 fill=TEAL, radius=15)
    # Clipboard between them
    clip_x = couple_cx - 30
    clip_y = couple_cy + 100
    rounded_rect(draw, (clip_x, clip_y, clip_x + 60, clip_y + 80), fill=WHITE, radius=8, outline=GREY, width=2)
    # Lines on clipboard
    for j in range(4):
        ly = clip_y + 15 + j * 16
        draw.line([(clip_x + 10, ly), (clip_x + 50, ly)], fill=LIGHT_GREY if j > 0 else PINK, width=2)

    # Caption under card
    f_cap = font_medium(20)
    cap_text = "Sit down together and combine your lists"
    bbox = draw.textbbox((0, 0), cap_text, font=f_cap)
    tw = bbox[2] - bbox[0]
    cap_x = card_x + (card_w2 - tw) // 2
    draw.text((cap_x, card_y + card_h2 + 20), cap_text, font=f_cap, fill=DARK_GREY)

    # Bottom bar
    rounded_rect(draw, (180, H - 140, W - 180, H - 100), fill=LIGHT_PINK, radius=12)
    f_tip = font_medium(20)
    text_center(draw, "💡  Pro Tip: Set a number limit before you start combining lists", H - 133, f_tip, PINK, W)

    save(img, "wedding-guest-list-couple-reviewing.jpg")


# =====================================================================
# IMAGE 3: Tier System
# =====================================================================
def make_tier_system():
    print("3. Tier system...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Subtle background
    gradient_v(draw, 0, 0, W, H, (252, 248, 255), WHITE)

    # Title
    f_title = font_bold(48)
    text_center(draw, "The A-B-C Tier System", 50, f_title, DARK, W)
    f_sub = font_light(26)
    text_center(draw, "Prioritise your guest list with a clear ranking method", 115, f_sub, DARK_GREY, W)

    # Separator
    draw_separator(draw, 170, W, TEAL)

    # Three columns
    col_w = 520
    col_h = 720
    gap = 40
    total_w = 3 * col_w + 2 * gap
    start_x = (W - total_w) // 2
    top_y = 210

    tiers = [
        {
            "label": "A-LIST",
            "color": PINK,
            "bg": LIGHT_PINK,
            "tag": "Must Invite",
            "items": [
                "Immediate family",
                "Wedding party members",
                "Closest friends (5+ years)",
                "Mentors & key figures",
                "Partner's immediate family",
            ],
            "count": "~40-60 guests",
        },
        {
            "label": "B-LIST",
            "color": TEAL,
            "bg": LIGHT_TEAL,
            "tag": "Invite If Space",
            "items": [
                "Extended family",
                "Work colleagues",
                "Neighbourhood friends",
                "University/school friends",
                "Partners of A-list guests",
            ],
            "count": "~30-50 guests",
        },
        {
            "label": "C-LIST",
            "color": GREY,
            "bg": LIGHT_GREY,
            "tag": "Optional",
            "items": [
                "Distant relatives",
                "Acquaintances",
                "Parents' friends",
                "Social media friends",
                "Plus-ones for B-list",
            ],
            "count": "~20-40 guests",
        },
    ]

    for i, tier in enumerate(tiers):
        x = start_x + i * (col_w + gap)
        color = tier["color"]
        bg = tier["bg"]

        # Card
        rounded_rect(draw, (x, top_y, x + col_w, top_y + col_h), fill=WHITE, radius=20, outline=(226, 232, 240), width=2)

        # Colored header
        # Top rounded part
        draw.rounded_rectangle((x, top_y, x + col_w, top_y + 110), radius=20, fill=color)
        draw.rectangle((x, top_y + 90, x + col_w, top_y + 110), fill=color)

        # Tier label
        f_tier = font_bold(36)
        text_center_xy(draw, tier["label"], x + col_w // 2, top_y + 35, f_tier, WHITE)
        # Tag
        f_tag = font_medium(20)
        tag_text = tier["tag"]
        bbox = draw.textbbox((0, 0), tag_text, font=f_tag)
        tw = bbox[2] - bbox[0]
        tag_x = x + (col_w - tw - 30) // 2
        rounded_rect(draw, (tag_x, top_y + 65, tag_x + tw + 30, top_y + 95), fill=WHITE, radius=12)
        text_center_xy(draw, tag_text, x + col_w // 2, top_y + 80, f_tag, color)

        # Criteria items
        f_item = font_regular(22)
        for j, item in enumerate(tier["items"]):
            iy = top_y + 140 + j * 65
            # Bullet
            draw_circle(draw, x + 45, iy + 12, 8, bg)
            draw_circle(draw, x + 45, iy + 12, 4, color)
            draw.text((x + 65, iy), item, font=f_item, fill=DARK)
            # Divider
            if j < len(tier["items"]) - 1:
                draw.line([(x + 30, iy + 45), (x + col_w - 30, iy + 45)], fill=LIGHT_GREY, width=1)

        # Count badge at bottom
        count_y = top_y + col_h - 75
        rounded_rect(draw, (x + 30, count_y, x + col_w - 30, count_y + 50), fill=bg, radius=12)
        f_count = font_bold(22)
        text_center_xy(draw, tier["count"], x + col_w // 2, count_y + 25, f_count, color)

    save(img, "wedding-guest-list-tier-system.jpg")


# =====================================================================
# IMAGE 4: Decision Tree
# =====================================================================
def make_decision_tree():
    print("4. Decision tree...")
    W, H = 1200, 900
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    gradient_v(draw, 0, 0, W, H, LIGHT_TEAL, WHITE)

    f_title = font_bold(38)
    text_center(draw, "Should You Invite This Person?", 30, f_title, DARK, W)
    f_sub = font_light(20)
    text_center(draw, "A simple decision tree to help you decide", 78, f_sub, DARK_GREY, W)

    # Flowchart nodes
    def draw_node(cx, cy, w, h, text, fill, text_color=WHITE, outline=None):
        rounded_rect(draw, (cx - w//2, cy - h//2, cx + w//2, cy + h//2),
                     fill=fill, radius=14, outline=outline, width=2 if outline else 0)
        f = font_bold(17) if fill in (PINK, TEAL, (34, 197, 94)) else font_regular(17)
        # Wrap text
        lines = text.split("\n")
        total_h = len(lines) * 24
        for i, line in enumerate(lines):
            text_center_xy(draw, line, cx, cy - total_h//2 + i * 24 + 12, f, text_color)

    def draw_label(cx, cy, text, color):
        f = font_bold(16)
        bbox = draw.textbbox((0, 0), text, font=f)
        tw = bbox[2] - bbox[0]
        rounded_rect(draw, (cx - tw//2 - 8, cy - 12, cx + tw//2 + 8, cy + 12), fill=color, radius=8)
        text_center_xy(draw, text, cx, cy, f, WHITE)

    mid = W // 2

    # Level 0: Start
    draw_node(mid, 140, 320, 55, "Have you spoken to them\nin the last 12 months?", PINK)

    # Level 1 branches
    # YES -> left
    draw_arrow(draw, mid - 80, 168, mid - 200, 220, TEAL, 3)
    draw_label(mid - 155, 195, "YES", TEAL)
    # NO -> right
    draw_arrow(draw, mid + 80, 168, mid + 200, 220, PINK, 3)
    draw_label(mid + 155, 195, "NO", PINK)

    # Level 1 left: Would you invite them to dinner?
    draw_node(mid - 200, 260, 300, 55, "Would you invite them\nto a dinner party?", TEAL)

    # Level 1 right: Are they family?
    draw_node(mid + 200, 260, 280, 55, "Are they family your\nparents expect?", DARK_GREY, WHITE)

    # Level 2 from left YES
    draw_arrow(draw, mid - 300, 288, mid - 380, 340, TEAL, 3)
    draw_label(mid - 350, 315, "YES", TEAL)
    draw_node(mid - 380, 385, 240, 55, "Will you still be close\nin 5 years?", TEAL)

    # Level 2 from left NO
    draw_arrow(draw, mid - 100, 288, mid - 30, 340, PINK, 3)
    draw_label(mid - 55, 315, "NO", PINK)
    draw_node(mid - 30, 385, 200, 50, "B-List or skip", LIGHT_GREY, DARK_GREY, outline=GREY)

    # Level 2 from right YES
    draw_arrow(draw, mid + 120, 288, mid + 60, 340, TEAL, 3)
    draw_label(mid + 80, 315, "YES", TEAL)
    draw_node(mid + 60, 385, 220, 55, "Discuss with parents\nfirst", LIGHT_PINK, DARK, outline=PINK)

    # Level 2 from right NO
    draw_arrow(draw, mid + 280, 288, mid + 360, 340, PINK, 3)
    draw_label(mid + 330, 315, "NO", PINK)
    draw_node(mid + 360, 385, 200, 50, "Safe to skip", LIGHT_GREY, DARK_GREY, outline=GREY)

    # Level 3 from "still close in 5 years" YES
    draw_arrow(draw, mid - 430, 413, mid - 480, 465, TEAL, 3)
    draw_label(mid - 465, 440, "YES", TEAL)
    # Green invite box
    draw_node(mid - 480, 510, 220, 60, "INVITE THEM!\nA-List", (34, 197, 94))

    # Level 3 from "still close in 5 years" NO
    draw_arrow(draw, mid - 330, 413, mid - 260, 465, PINK, 3)
    draw_label(mid - 285, 440, "NO", PINK)
    draw_node(mid - 260, 510, 200, 50, "B-List them", LIGHT_GREY, DARK_GREY, outline=GREY)

    # Bottom legend
    legend_y = H - 170
    rounded_rect(draw, (100, legend_y, W - 100, H - 30), fill=WHITE, radius=16, outline=(226, 232, 240), width=2)

    f_leg_title = font_bold(20)
    draw.text((140, legend_y + 15), "Quick Guide:", font=f_leg_title, fill=DARK)

    f_leg = font_regular(18)
    items = [
        (PINK, "Decision Point"),
        (TEAL, "Positive Path"),
        ((34, 197, 94), "Invite!"),
        (GREY, "Skip / B-List"),
    ]
    lx = 140
    for color, label in items:
        ly = legend_y + 55
        rounded_rect(draw, (lx, ly, lx + 24, ly + 24), fill=color, radius=6)
        draw.text((lx + 32, ly + 1), label, font=f_leg, fill=DARK)
        lx += 220

    # Tip
    f_tip = font_medium(17)
    tip = "Remember: There's no perfect guest list. Trust your instincts and communicate openly."
    bbox = draw.textbbox((0, 0), tip, font=f_tip)
    tw = bbox[2] - bbox[0]
    text_center(draw, tip, legend_y + 100, f_tip, DARK_GREY, W)

    save(img, "wedding-guest-list-decision-tree.jpg")


# =====================================================================
# IMAGE 5: Having The Conversation / Discussion
# =====================================================================
def make_discussion():
    print("5. Discussion card...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    gradient_v(draw, 0, 0, W, H, LIGHT_TEAL, WHITE)

    # Left accent bar
    gradient_v(draw, 0, 0, 10, H, TEAL, PINK)

    # Header area
    rounded_rect(draw, (80, 50, W - 80, 180), fill=WHITE, radius=20, outline=(226, 232, 240), width=2)

    # Speech bubble icon
    icon_x = 140
    rounded_rect(draw, (icon_x, 75, icon_x + 60, 130), fill=TEAL, radius=12)
    draw.polygon([(icon_x + 15, 130), (icon_x + 10, 150), (icon_x + 35, 130)], fill=TEAL)
    # Three dots
    for dx in range(3):
        draw_circle(draw, icon_x + 18 + dx * 14, 102, 4, WHITE)

    f_title = font_bold(44)
    draw.text((icon_x + 80, 72), "Having The Conversation", font=f_title, fill=DARK)
    f_sub = font_light(24)
    draw.text((icon_x + 80, 130), "Key talking points for trimming your guest list together", font=f_sub, fill=DARK_GREY)

    # Main content - 3x2 grid of talking point cards
    points = [
        ("Set the Budget First", "Agree on a per-head cost so the\nnumber limit feels logical, not personal.", PINK),
        ("Venue Capacity", "Let the venue be the 'bad guy' — blame\nthe space limit, not personal preference.", TEAL),
        ("Equal Representation", "Each side gets roughly equal numbers.\nThis prevents one family dominating.", PINK),
        ("The Plus-One Policy", "Decide a clear rule: partners of 6+ months?\nEngaged/married only? Be consistent.", TEAL),
        ("Kids or No Kids", "Set a blanket rule for children — exceptions\ncreate resentment among guests.", PINK),
        ("Parent Expectations", "Give parents a set number of 'their' invites.\nThis sets boundaries with respect.", TEAL),
    ]

    cols = 3
    card_w = 540
    card_h = 230
    gap_x = 40
    gap_y = 30
    grid_w = cols * card_w + (cols - 1) * gap_x
    start_x = (W - grid_w) // 2
    start_y = 220

    for idx, (title, body, color) in enumerate(points):
        row = idx // cols
        col = idx % cols
        cx = start_x + col * (card_w + gap_x)
        cy = start_y + row * (card_h + gap_y)

        rounded_rect(draw, (cx, cy, cx + card_w, cy + card_h), fill=WHITE, radius=16, outline=(226, 232, 240), width=2)

        # Color bar top
        draw.rounded_rectangle((cx, cy, cx + card_w, cy + 8), radius=4, fill=color)

        # Number badge
        badge_x = cx + 30
        badge_y = cy + 30
        draw_circle(draw, badge_x, badge_y + 15, 18, color)
        f_num = font_bold(20)
        text_center_xy(draw, str(idx + 1), badge_x, badge_y + 15, f_num, WHITE)

        f_card_title = font_bold(24)
        draw.text((badge_x + 30, badge_y), title, font=f_card_title, fill=DARK)

        f_card_body = font_regular(19)
        draw.text((cx + 25, cy + 80), body, font=f_card_body, fill=DARK_GREY)

    # Bottom bar
    bar_y = H - 80
    rounded_rect(draw, (80, bar_y, W - 80, H - 30), fill=LIGHT_PINK, radius=14)
    f_bottom = font_medium(20)
    text_center(draw, "Remember: You're building a guest list together — compromise is key", bar_y + 12, f_bottom, PINK, W)

    save(img, "wedding-guest-list-discussion.jpg")


# =====================================================================
# IMAGE 6: Family Expectations
# =====================================================================
def make_family_conversation():
    print("6. Family expectations...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    gradient_v(draw, 0, 0, W, H, (255, 247, 237), WHITE)  # warm bg

    # Header
    rounded_rect(draw, (0, 0, W, 130), fill=PINK, radius=0)
    f_title = font_bold(44)
    text_center(draw, "Managing Family Expectations", 25, f_title, WHITE, W)
    f_sub = font_light(24)
    text_center(draw, "Common scenarios and how to handle them gracefully", 82, f_sub, LIGHT_PINK, W)

    # Scenarios - left/right alternating
    scenarios = [
        {
            "scenario": '"Your father and I want to invite the Hendersons..."',
            "who": "From: Parents",
            "response": "\"We love the Hendersons! We've allocated 10 spots for each\nof your guest picks. Would you like to include them in your 10?\"",
            "tip": "Give parents ownership of a set number",
        },
        {
            "scenario": '"But ALL the cousins have to come!"',
            "who": "From: Extended Family",
            "response": "\"We'd love to have everyone, but with 120 seats, we've had to\nlimit extended family. We're planning a casual get-together after.\"",
            "tip": "Offer an alternative celebration",
        },
        {
            "scenario": '"I assumed I could bring a date?"',
            "who": "From: Single Friends",
            "response": "\"We're keeping it to established couples only — it's not personal!\nWe want to be surrounded by people who know us both.\"",
            "tip": "Apply the rule consistently",
        },
    ]

    f_scenario = font_medium(24)
    f_who = font_bold(18)
    f_response = font_regular(20)
    f_tip_label = font_bold(18)
    f_tip = font_regular(18)

    card_y = 170
    for i, s in enumerate(scenarios):
        cy = card_y + i * 270
        # Main card
        rounded_rect(draw, (100, cy, W - 100, cy + 245), fill=WHITE, radius=18, outline=(226, 232, 240), width=2)

        # Scenario quote
        color = PINK if i % 2 == 0 else TEAL
        rounded_rect(draw, (100, cy, 108, cy + 245), fill=color, radius=0)

        # Who badge
        badge_bg = LIGHT_PINK if color == PINK else LIGHT_TEAL
        rounded_rect(draw, (140, cy + 15, 340, cy + 45), fill=badge_bg, radius=10)
        draw.text((155, cy + 18), s["who"], font=f_who, fill=color)

        # Scenario text
        draw.text((140, cy + 58), s["scenario"], font=f_scenario, fill=DARK)

        # Response box
        resp_y = cy + 110
        rounded_rect(draw, (140, resp_y, W - 140, resp_y + 75), fill=LIGHT_GREY, radius=12)
        f_resp_label = font_bold(16)
        draw.text((160, resp_y + 5), "SUGGESTED RESPONSE:", font=f_resp_label, fill=DARK_GREY)
        draw.text((160, resp_y + 28), s["response"], font=f_response, fill=DARK)

        # Tip
        tip_y = cy + 200
        draw_circle(draw, 160, tip_y + 10, 10, color)
        text_center_xy(draw, "!", 160, tip_y + 10, font_bold(14), WHITE)
        draw.text((180, tip_y), s["tip"], font=f_tip, fill=color)

    save(img, "wedding-guest-list-family-conversation.jpg")


# =====================================================================
# IMAGE 7: Scripts for Difficult Conversations
# =====================================================================
def make_conversation_scripts():
    print("7. Conversation scripts...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    gradient_v(draw, 0, 0, W, H, LIGHT_PINK, WHITE)

    # Title area
    f_title = font_bold(44)
    text_center(draw, "Scripts for Difficult Conversations", 45, f_title, DARK, W)

    gradient_h(draw, 300, 105, W - 300, 109, PINK, TEAL)

    f_sub = font_light(22)
    text_center(draw, "Copy-paste these scripts when you need to have tough talks", 120, f_sub, DARK_GREY, W)

    # Scripts in cards
    scripts = [
        {
            "title": "Telling Someone They're Not Invited",
            "icon_color": PINK,
            "script": "\"We've had to keep our wedding really intimate due to\nvenue/budget constraints. We hope you understand —\nwe'd love to celebrate with you at [alternative event].\"",
        },
        {
            "title": "Explaining No Kids Policy",
            "icon_color": TEAL,
            "script": "\"We've decided on an adults-only celebration so everyone\ncan relax and enjoy. We completely understand if this\nmeans you can't make it — no hard feelings at all.\"",
        },
        {
            "title": "Declining a Plus-One Request",
            "icon_color": PINK,
            "script": "\"We'd love to include everyone, but we've limited plus-ones\nto long-term partners only. You'll know plenty of people\nthere though — we'll make sure you're seated with friends!\"",
        },
        {
            "title": "Setting Boundaries with Parents",
            "icon_color": TEAL,
            "script": "\"We really value your input! We've set aside [X] spots for\nyour must-haves. Could you prioritise your top [X] people?\nThat way everyone important to you is included.\"",
        },
    ]

    card_h = 185
    gap = 22
    start_y = 175

    for i, s in enumerate(scripts):
        cy = start_y + i * (card_h + gap)

        # Card
        rounded_rect(draw, (120, cy, W - 120, cy + card_h), fill=WHITE, radius=18, outline=(226, 232, 240), width=2)

        # Left color accent
        draw.rounded_rectangle((120, cy, 130, cy + card_h), radius=0, fill=s["icon_color"])

        # Number circle
        n_x, n_y = 175, cy + 30
        draw_circle(draw, n_x, n_y, 22, s["icon_color"])
        f_n = font_bold(22)
        text_center_xy(draw, str(i + 1), n_x, n_y, f_n, WHITE)

        # Title
        f_card_title = font_bold(26)
        draw.text((210, cy + 15), s["title"], font=f_card_title, fill=DARK)

        # Script box
        script_y = cy + 58
        rounded_rect(draw, (155, script_y, W - 155, cy + card_h - 18),
                     fill=LIGHT_GREY, radius=12)

        # Quote mark
        f_quote = font_bold(40)
        draw.text((170, script_y + 2), '"', font=f_quote, fill=s["icon_color"])

        f_script = font_regular(19)
        draw.text((200, script_y + 15), s["script"], font=f_script, fill=DARK)

    save(img, "wedding-guest-list-conversation.jpg")


# =====================================================================
# IMAGE 8: Spreadsheet
# =====================================================================
def make_spreadsheet():
    print("8. Spreadsheet mock...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # App-like background
    draw.rectangle((0, 0, W, H), fill=(248, 250, 252))

    # Title bar
    rounded_rect(draw, (60, 30, W - 60, 100), fill=WHITE, radius=16, outline=(226, 232, 240), width=2)
    f_title = font_bold(30)
    draw.text((100, 47), "Wedding Guest List Tracker", font=f_title, fill=DARK)

    # Stats badges
    stats = [
        ("Total: 124", PINK),
        ("Confirmed: 89", TEAL),
        ("Pending: 28", GOLD),
        ("Declined: 7", GREY),
    ]
    sx = W - 120
    f_stat = font_bold(18)
    for label, color in reversed(stats):
        bbox = draw.textbbox((0, 0), label, font=f_stat)
        tw = bbox[2] - bbox[0]
        sx -= tw + 36
        rounded_rect(draw, (sx, 50, sx + tw + 30, 80), fill=color, radius=10)
        draw.text((sx + 15, 53), label, font=f_stat, fill=WHITE)
        sx -= 10

    # Spreadsheet area
    table_x = 60
    table_y = 120
    table_w = W - 120
    table_h = H - 170

    rounded_rect(draw, (table_x, table_y, table_x + table_w, table_y + table_h),
                 fill=WHITE, radius=16, outline=(226, 232, 240), width=2)

    # Columns
    cols = [
        ("", 60),          # Row number
        ("Guest Name", 340),
        ("Tier", 120),
        ("RSVP Status", 180),
        ("Meal Choice", 200),
        ("Dietary Notes", 240),
        ("Table #", 120),
        ("Side", 150),
        ("Plus One", 130),
    ]

    # Header row
    header_y = table_y + 10
    header_h = 50
    cx = table_x + 20

    # Header background
    draw.rounded_rectangle((table_x + 4, header_y, table_x + table_w - 4, header_y + header_h),
                           radius=10, fill=DARK)

    f_header = font_bold(18)
    f_cell = font_regular(18)
    f_row_num = font_regular(16)

    for col_name, col_w in cols:
        text_center_xy(draw, col_name, cx + col_w // 2, header_y + header_h // 2, f_header, WHITE)
        cx += col_w

    # Data rows
    rows = [
        ("1", "Sarah & James Mitchell", "A", "Confirmed", "Chicken", "—", "1", "Bride", "N/A"),
        ("2", "Emma Thompson", "A", "Confirmed", "Vegetarian", "Gluten-free", "2", "Bride", "Yes"),
        ("3", "David & Lisa Chen", "A", "Confirmed", "Fish", "—", "1", "Groom", "N/A"),
        ("4", "Mark Williams", "B", "Pending", "—", "—", "TBD", "Groom", "No"),
        ("5", "Rachel Green", "A", "Confirmed", "Beef", "Dairy-free", "3", "Bride", "Yes"),
        ("6", "Tom & Amy Baker", "B", "Pending", "—", "—", "TBD", "Bride", "N/A"),
        ("7", "Uncle Robert", "A", "Confirmed", "Chicken", "—", "4", "Groom", "Yes"),
        ("8", "Sophie Laurent", "B", "Confirmed", "Vegan", "Nut allergy", "5", "Bride", "No"),
        ("9", "Michael O'Brien", "A", "Declined", "—", "—", "—", "Groom", "—"),
        ("10", "Priya & Raj Patel", "A", "Confirmed", "Vegetarian", "—", "3", "Groom", "N/A"),
        ("11", "Kate Murphy", "C", "Pending", "—", "—", "TBD", "Bride", "No"),
        ("12", "Chris & Jenny Adams", "B", "Confirmed", "Beef", "—", "5", "Bride", "N/A"),
        ("13", "Aunt Margaret", "A", "Confirmed", "Fish", "Low sodium", "4", "Groom", "Yes"),
        ("14", "Leo Zhang", "C", "Pending", "—", "—", "TBD", "Groom", "No"),
    ]

    row_h = 52
    for r_idx, row in enumerate(rows):
        ry = header_y + header_h + 8 + r_idx * row_h
        if ry + row_h > table_y + table_h - 10:
            break

        # Alternating row background
        if r_idx % 2 == 0:
            draw.rectangle((table_x + 8, ry, table_x + table_w - 8, ry + row_h), fill=(248, 250, 252))

        cx = table_x + 20
        for c_idx, (col_name, col_w) in enumerate(cols):
            val = row[c_idx]

            if c_idx == 0:  # Row number
                text_center_xy(draw, val, cx + col_w // 2, ry + row_h // 2, f_row_num, GREY)
            elif c_idx == 2:  # Tier - colored badge
                colors_map = {"A": PINK, "B": TEAL, "C": GREY}
                bg_map = {"A": LIGHT_PINK, "B": LIGHT_TEAL, "C": LIGHT_GREY}
                tc = colors_map.get(val, GREY)
                tb = bg_map.get(val, LIGHT_GREY)
                mid_x = cx + col_w // 2
                mid_y = ry + row_h // 2
                rounded_rect(draw, (mid_x - 25, mid_y - 14, mid_x + 25, mid_y + 14), fill=tb, radius=8)
                text_center_xy(draw, val, mid_x, mid_y, font_bold(16), tc)
            elif c_idx == 3:  # RSVP Status - colored
                status_colors = {"Confirmed": (34, 197, 94), "Pending": GOLD, "Declined": (239, 68, 68)}
                sc = status_colors.get(val, DARK)
                mid_x = cx + col_w // 2
                mid_y = ry + row_h // 2
                bbox = draw.textbbox((0, 0), val, font=f_cell)
                tw = bbox[2] - bbox[0]
                # Dot indicator
                draw_circle(draw, mid_x - tw // 2 - 10, mid_y, 5, sc)
                text_center_xy(draw, val, mid_x + 5, mid_y, f_cell, sc)
            else:
                text_center_xy(draw, val, cx + col_w // 2, ry + row_h // 2, f_cell, DARK)

            cx += col_w

        # Row separator
        draw.line([(table_x + 20, ry + row_h), (table_x + table_w - 20, ry + row_h)], fill=(241, 245, 249), width=1)

    # Bottom bar
    bar_y = H - 45
    f_bottom = font_medium(16)
    draw.text((table_x + 20, bar_y), "Showing 14 of 124 guests", font=f_bottom, fill=GREY)
    draw.text((W - 350, bar_y), "openclaw.com.au — Guest List Tracker", font=f_bottom, fill=GREY)

    save(img, "wedding-guest-list-spreadsheet.jpg")


# =====================================================================
# IMAGE 9: Video Thumbnail
# =====================================================================
def make_video_thumb():
    print("9. Video thumbnail...")
    W, H = 1920, 1080
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    # Gradient background
    gradient_h(draw, 0, 0, W, H, PINK, TEAL)

    # Diagonal decorative lines
    for i in range(-H, W + H, 60):
        draw.line([(i, 0), (i + H, H)], fill=(255, 255, 255), width=1)

    # Dark overlay for depth
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 60))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Central play button
    cx, cy = W // 2, H // 2 - 30
    # Outer circle (white, semi-transparent effect via lighter shade)
    r_outer = 100
    draw_circle(draw, cx, cy, r_outer, WHITE)
    draw_circle(draw, cx, cy, r_outer - 5, (255, 255, 255))

    # Inner gradient circle
    for ri in range(r_outer - 8, 0, -1):
        t = ri / (r_outer - 8)
        r = int(PINK[0] * t + TEAL[0] * (1 - t))
        g = int(PINK[1] * t + TEAL[1] * (1 - t))
        b = int(PINK[2] * t + TEAL[2] * (1 - t))
        draw_circle(draw, cx, cy, ri, (r, g, b))

    # Play triangle
    tri_size = 40
    play_offset = 8  # shift right slightly for visual centering
    draw.polygon([
        (cx - tri_size + play_offset, cy - tri_size - 5),
        (cx - tri_size + play_offset, cy + tri_size + 5),
        (cx + tri_size + play_offset, cy),
    ], fill=WHITE)

    # Title text below play button
    f_title = font_bold(56)
    text_center(draw, "How to Trim Your Guest List", cy + 140, f_title, WHITE, W)

    f_sub = font_light(30)
    text_center(draw, "Without Losing Friends or Family", cy + 210, f_sub, (255, 255, 255), W)

    # Duration badge
    dur_y = cy + 280
    f_dur = font_bold(22)
    dur_text = "▶  8:42"
    bbox = draw.textbbox((0, 0), dur_text, font=f_dur)
    tw = bbox[2] - bbox[0]
    rounded_rect(draw, (W//2 - tw//2 - 20, dur_y, W//2 + tw//2 + 20, dur_y + 40),
                 fill=(0, 0, 0), radius=12)
    text_center(draw, dur_text, dur_y + 6, f_dur, WHITE, W)

    # Corner branding
    f_brand = font_medium(22)
    draw.text((60, H - 60), "openclaw.com.au", font=f_brand, fill=WHITE)

    # Corner decorations
    for offset_x, offset_y in [(60, 60), (W - 60, 60), (60, H - 90), (W - 60, H - 90)]:
        draw_diamond(draw, offset_x, offset_y, 8, WHITE)

    save(img, "wedding-guest-list-video-thumb.jpg")


# =====================================================================
# MAIN
# =====================================================================
if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    print("Generating wedding guest list images...\n")
    make_hero()
    make_couple_reviewing()
    make_tier_system()
    make_decision_tree()
    make_discussion()
    make_family_conversation()
    make_conversation_scripts()
    make_spreadsheet()
    make_video_thumb()
    print("\nDone! All 9 images generated.")
