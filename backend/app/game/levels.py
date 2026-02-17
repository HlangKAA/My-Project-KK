
LEVELS = {
    1: {
        "title": "Level 1: The Red Channel",
        "concept": "Variables & Types",
        "description": "In Computer Vision, images are made of 3 color channels: Red, Green, Blue. Each pixel has a value from 0 to 255.<br><br>The Red Channel has been corrupted (set to 0). Variable assignment is how we store data in memory.",
        "objective": "Restore the Red Channel intensity to max value (255).",
        "initial_code": """# Level 1: Restore the Red Channel
# Pixel intensity ranges from 0 (off) to 255 (max)

# The red channel is currently 0 (missing)
red_intensity = 0
green_intensity = 0
blue_intensity = 0

# TODO: Set red_intensity to 255 to restore the color
# red_intensity = ?

# Send the color values to the spell
hero.cast_color(red_intensity, green_intensity, blue_intensity)
""",
        "hint": "Assign the value 255 to the variable red_intensity",
        "solution_check": "red_intensity == 255"
    },
    2: {
        "title": "Level 2: The Hidden Signal",
        "concept": "Lists & Arrays",
        "description": "An image is essentially a matrix (a list of lists) of pixels. extracting information often requires accessing specific data points by their Index.<br><br><b>Remember:</b> In Python, counting starts at 0.",
        "objective": "Find the signal fragment located at Index 2 of the list.",
        "initial_code": """# Level 2: Accessing Data
# We found these signal fragments:
color_fragments = [10, 25, 46, 80]
# Index:           0   1   2   3

# TODO: Access the value at Index 2
# target_pos = color_fragments[?]

# Move hero to that position
hero.move_to_x(target_pos)
""",
        "hint": "Use square brackets [] to access a list item. E.g., color_fragments[2]",
        "solution_check": "target_pos == 46"
    },
    3: {
        "title": "Level 3: Shadow vs Light",
        "concept": "Conditionals & Thresholding",
        "description": "Object Detection starts with 'Thresholding' - separating objects from background based on pixel intensity.<br><br>We need to collect only the bright fragments (Intensity > 150).",
        "objective": "Collect the fragment ONLY if the light value is greater than 150.",
        "initial_code": """# Level 3: Thresholding
# Scan the current area light value
light_value = hero.scan_light()

# TODO: Write an if-statement
# If light_value is greater than 150, collect it.
# Else, avoid it.

if light_value > 150:
    # hero.collect_fragment()
    pass
else:
    # hero.avoid_shadow()
    pass
""",
        "hint": "Use the > operator. Ensure you call hero.collect_fragment() inside the if block.",
        "solution_check": "dynamic" # Checked in JS/Python runtime based on logic
    }
}

def get_level(level_id):
    return LEVELS.get(level_id)
