# 📖 คู่มือเฉลย The Lost Spectrum (29 ด่าน)

> อัปเดตตาม `frontend/src/data/*` และ `backend/app/game/catalog.json` ปัจจุบัน (4 ภูมิภาค: 7 + 8 + 7 + 7 = 29 ด่าน)
> วิธีใช้: ลบโค้ดเดิมใน editor แล้ววางโค้ดของแต่ละด่านทั้งก้อน จากนั้นกด Run

---

## 🌲 Region 1: THE RED FOREST

### 1-1: The Awakening Altar (lesson)
เดินไปที่ Altar (6, 2) แล้วพูด `Lumina`

```python
hero.move_right(5)
print("Lumina")
```

### 1-2: The Alchemist's Flasks (lesson)
หยิบค่าแต่ละชนิดใส่ flask ให้ตรงชนิด (str, int, float, bool)

```python
# str
hero.move_right(1)
hero.move_down(1)
hero.pick_up()
hero.move_up(1)
hero.put_in("str")

# int
hero.move_right(2)
hero.move_down(1)
hero.pick_up()
hero.move_up(1)
hero.put_in("int")

# float
hero.move_right(2)
hero.move_down(1)
hero.pick_up()
hero.move_up(1)
hero.put_in("float")

# bool
hero.move_right(2)
hero.move_down(1)
hero.pick_up()
hero.move_up(1)
hero.put_in("bool")
```

### 1-3: The Whispering Runes (challenge)
ใช้ f-string ทักทาย Eldrin

```python
name = "Eldrin"
hero.move_right(4)
print(f"Welcome, {name}!")
```

### 1-4: The Forked Path (challenge)
ใช้ if/else เลือกจำนวนก้าว

```python
lantern_lit = True
if lantern_lit:
    steps = 5
else:
    steps = 2
hero.move_right(steps)
```

### 1-5: Echo Grove (challenge)
รวมค่าใน list ด้วย for loop

```python
steps = [1, 1, 1, 1, 1]
total = 0
for step in steps:
    total += step
hero.move_right(total)
```

### 1-6: Spell Workshop (challenge)
เขียนฟังก์ชันที่ใช้พารามิเตอร์ (ระบบจะตรวจ `double_steps(3) == 6` และ `double_steps(0) == 0` ด้วย)

```python
def double_steps(steps):
    return steps * 2

hero.move_right(double_steps(2) + 1)
```

### 1-7: The Apprentice Gate (boss)
เก็บกุญแจ ใส่ Lock Flask เดินไปที่ประตู แล้วพูดด้วย f-string

```python
name = "Eldrin"
hero.move_right(2)
hero.move_up(2)
hero.pick_up()
hero.move_down(4)
hero.put_in("str")
hero.move_up(2)
hero.move_right(8)
print(f"Open, {name}!")
```

---

## 📜 Region 2: THE SCHOLAR'S ARCHIVE

### 2-1: The Faded Manuscript (lesson)
เพิ่มความสว่าง +40 ทุกช่องสี (ไม่เกิน 255) → ผลลัพธ์ (120, 95, 70)

```python
r, g, b = 80, 55, 30
hero.move_right(3)
hero.cast_color(min(255, r + 40), min(255, g + 40), min(255, b + 40))
```

### 2-2: The Tinted Lenses (challenge)
เลนส์แรก +50 แดง, เลนส์สอง +80 น้ำเงิน

```python
warm_r, warm_g, warm_b = 45, 90, 170
cool_r, cool_g, cool_b = 160, 90, 40
hero.move_right(1)
hero.cast_color(warm_r + 50, warm_g, warm_b)
hero.move_right(4)
hero.cast_color(cool_r, cool_g, cool_b + 80)
```

### 2-3: The Mirror Gallery (challenge)
กลับสี (255 - ค่าเดิม)

```python
first_r, first_g, first_b = 40, 90, 150
second_r, second_g, second_b = 200, 80, 20
hero.move_right(1)
hero.cast_color(255 - first_r, 255 - first_g, 255 - first_b)
hero.move_right(4)
hero.cast_color(255 - second_r, 255 - second_g, 255 - second_b)
```

### 2-4: Gray Memory (challenge)
Grayscale = (r + g + b) // 3 → 90, 90, 120

```python
first_r, first_g, first_b = 30, 90, 150
middle_r, middle_g, middle_b = 180, 60, 30
final_r, final_g, final_b = 15, 135, 210
hero.move_up(2)
shade = (first_r + first_g + first_b) // 3
hero.cast_color(shade, shade, shade)
hero.move_right(3)
shade = (middle_r + middle_g + middle_b) // 3
hero.cast_color(shade, shade, shade)
hero.move_right(3)
shade = (final_r + final_g + final_b) // 3
hero.cast_color(shade, shade, shade)
```

### 2-5: The Palette Lock (challenge)
+40 ความสว่าง → กลับสี → grayscale

```python
bright_r, bright_g, bright_b = 20, 30, 40
inverse_r, inverse_g, inverse_b = 0, 100, 255
gray_r, gray_g, gray_b = 60, 90, 120
hero.move_up(2)
hero.cast_color(min(255, bright_r + 40), min(255, bright_g + 40), min(255, bright_b + 40))
hero.move_right(3)
hero.cast_color(255 - inverse_r, 255 - inverse_g, 255 - inverse_b)
hero.move_right(3)
shade = (gray_r + gray_g + gray_b) // 3
hero.cast_color(shade, shade, shade)
```

### 2-6: The Color Mixer (challenge)
เหลือง (255, 255, 0) และ ม่วงแดง (255, 0, 255)

```python
red, green, blue = 255, 255, 0
hero.move_right(1)
hero.cast_color(red, green, blue)

hero.move_right(4)
hero.cast_color(255, 0, 255)
```

### 2-7: Pixel Trail (challenge)
ฟังก์ชันเพิ่มแดง +30 ทุกพิกเซล (ระบบตรวจกับข้อมูลชุดอื่นด้วย)

```python
def restore(pixels):
    result = []
    for r, g, b in pixels:
        result.append([r + 30, g, b])
    return result

pixels = [[40, 20, 10], [20, 60, 120], [90, 70, 30]]
colors = restore(pixels)
for index, color in enumerate(colors):
    hero.cast_color(color[0], color[1], color[2])
    if index < len(colors) - 1:
        hero.move_right(3)
```

### 2-8: The Living Atlas (boss)
+50 ความสว่าง → กลับสี → grayscale แล้วเดินไปข้างประตู (9, 4)

```python
light_r, light_g, light_b = 20, 30, 40
mirror_r, mirror_g, mirror_b = 0, 100, 255
silver_r, silver_g, silver_b = 60, 90, 120
hero.move_up(3)
hero.cast_color(min(255, light_r + 50), min(255, light_g + 50), min(255, light_b + 50))
hero.move_right(3)
hero.cast_color(255 - mirror_r, 255 - mirror_g, 255 - mirror_b)
hero.move_right(3)
shade = (silver_r + silver_g + silver_b) // 3
hero.cast_color(shade, shade, shade)
hero.move_down(2)
hero.move_right(2)
```

---

## 🦇 Region 3: WHISPERING CAVERNS & ⛰️ Region 4: ASH PEAKS

> ด่าน 3-1 ถึง 4-7 แก้แค่ส่วนในฟังก์ชัน `transform(pixels)` ส่วนโค้ดเดินกับร่ายสีด้านล่างเป็นโค้ดเดิมที่เกมให้มา
> ระบบจะตรวจฟังก์ชันกับข้อมูลชุดอื่นที่ซ่อนไว้ด้วย จึงต้องเขียนตรรกะให้ถูก ใส่ค่าคำตอบตายตัวไม่ได้

### 3-1: The Inscription Wall (lesson)
Return a new list containing the three pixels in their original order. A digital image is a list of RGB pixels; each rune is one pixel.

```python
def transform(pixels):
    return [pixels[0], pixels[1], pixels[2]]

pixels = [[220,40,35],[40,200,90],[35,90,220]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-2: Rune Positions (challenge)
The first and last pixels were swapped. Return them in the correct order. Pixel indexing locates an exact position in an image row.

```python
def transform(pixels):
    return [pixels[2], pixels[1], pixels[0]]

pixels = [[35,90,220],[40,200,90],[220,40,35]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-3: The Matrix Search (challenge)
Find the pixel with the most red using .index() and max(). Turn that pixel gold. Searching a pixel row finds the brightest red sample, a simple feature detector.

```python
def transform(pixels):
    reds = [pixel[0] for pixel in pixels]
    position = reds.index(max(reds))
    result = pixels[:] 
    result[position] = [255, 200, 40]
    return result

pixels = [[20,50,90],[180,30,50],[70,70,70]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-4: The Echo Loop (lesson)
Brighten every channel by 30, stopping at 255. A for loop applies the same image filter to every pixel.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        result.append([min(255, channel + 30) for channel in pixel])
    return result

pixels = [[50,70,90],[140,40,70],[240,220,200]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-5: Broken Arrays (challenge)
Fix the loop so it adds 20 to red only, capped at 255; keep green and blue. A faulty loop shifts pixel channels and corrupts an image.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        result.append([min(255, pixel[0] + 20), pixel[1], pixel[2]])
    return result

pixels = [[20,40,90],[80,140,30],[250,20,50]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-6: The Hidden Pattern (challenge)
If the outer pixels match, make the center gold; otherwise leave the row unchanged. A repeated pixel pattern can reveal a feature hidden in an image.

```python
def transform(pixels):
    result = pixels[:] 
    if pixels[0] == pixels[2]:
        result[1] = [255, 200, 40]
    return result

pixels = [[220,40,35],[30,30,30],[220,40,35]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 3-7: The Cavern Trial (boss)
Find the pixel with the most red and turn it gold. Keep the other pixels unchanged. Searching and indexing locate a color feature in an image row.

```python
def transform(pixels):
    reds = [pixel[0] for pixel in pixels]
    result = pixels[:] 
    result[reds.index(max(reds))] = [255, 200, 40]
    return result

pixels = [[30,40,50],[200,30,20],[70,80,90]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
hero.move_down(2)
```

### 4-1: The Crossroads (lesson)
For every pixel, average its RGB values. Use white when the average is at least 128, otherwise black. Thresholding turns image brightness into a black or white mask.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        if sum(pixel) / 3 >= 128:
            result.append([255, 255, 255])
        else:
            result.append([0, 0, 0])
    return result

pixels = [[30,30,30],[180,180,180],[90,150,120]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-2: Path Selection (challenge)
Classify average brightness: below 85 blue, below 170 gold, otherwise white. if/elif/else selects a different filter for each brightness range.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        light = sum(pixel) / 3
        if light < 85:
            result.append([35, 90, 220])
        elif light < 170:
            result.append([255, 200, 40])
        else:
            result.append([240, 240, 240])
    return result

pixels = [[30,30,30],[120,120,120],[220,220,220]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-3: Truth and Lies (challenge)
Keep a pixel only if red is above 100 AND blue is below 100; make all others black. Boolean masks select pixels by combining channel conditions.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        if pixel[0] > 100 and pixel[2] < 100:
            result.append(pixel)
        else:
            result.append([0, 0, 0])
    return result

pixels = [[180,30,40],[40,200,40],[180,30,180]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-4: Broken Bridges (challenge)
Fix the comparison: keep pixels whose average brightness is at least 100; black out the rest. A reversed comparison breaks a threshold mask and hides the wrong pixels.

```python
def transform(pixels):
    result = []
    for pixel in pixels:
        if sum(pixel) / 3 >= 100:
            result.append(pixel)
        else:
            result.append([0, 0, 0])
    return result

pixels = [[30,30,30],[100,100,100],[200,150,100]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-5: Shadow Boundaries (challenge)
Make a pixel gold if its red value differs from the previous pixel by at least 80; keep other pixels. Comparing neighboring red values can reveal a color boundary.

```python
def transform(pixels):
    result = [pixels[0]]
    for index in range(1, len(pixels)):
        left = pixels[index - 1][0]
        right = pixels[index][0]
        if abs(right - left) >= 80:
            result.append([255, 200, 40])
        else:
            result.append(pixels[index])
    return result

pixels = [[30,30,30],[200,200,200],[210,210,210]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-6: The Color Seal (challenge)
Turn pixels with every channel below 100 into gold. Keep all other pixels unchanged. A color mask selects dark pixels while leaving other colors alone.

```python
def transform(pixels):
    result = []
    for r, g, b in pixels:
        if r < 100 and g < 100 and b < 100:
            result.append([255, 200, 40])
        else:
            result.append([r, g, b])
    return result

pixels = [[20,30,40],[180,60,40],[40,150,240]]
colors = transform(pixels)
for color in colors:
    hero.cast_color(color[0], color[1], color[2])
    hero.move_right(3)
```

### 4-7: The Light Convergence (boss)
If average brightness is below 85, make white. If red is strongest, add 50 blue. Otherwise keep the pixel. Avoid the marked shadow tiles, restore all three seals, and reach the gate. Five minutes of active execution time.

```python
def transform(pixels):
    result = []
    for r, g, b in pixels:
        if (r + g + b) / 3 < 85:
            result.append([255, 255, 255])
        elif r > g and r > b:
            result.append([r, g, min(255, b + 50)])
        else:
            result.append([r, g, b])
    return result

pixels = [[20,30,40],[200,40,30],[40,180,90]]
colors = transform(pixels)
for index, color in enumerate(colors):
    hero.cast_color(color[0], color[1], color[2])
    if index < 2:
        hero.move_up(1)
        hero.move_right(3)
        hero.move_down(1)
hero.move_right(2)
hero.move_down(2)
```

