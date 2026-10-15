# 📖 คู่มือเฉลย (Solutions) The Lost Spectrum

เอกสารนี้รวบรวมเฉลยของด่านทั้งหมดใน The Lost Spectrum ทั้ง 26 ด่านจากทั้ง 4 ภูมิภาค (Regions)

---

## 🌲 Region 1: THE RED FOREST

### 1-1: The Awakening Tower (Lesson)
**แนวคิด:** ใช้คำสั่ง `print()` พื้นฐาน
```python
name = "Lumina"
print(name)
```

### 1-2: First Words (Guided)
**แนวคิด:** เติมคำในช่องว่าง เรื่องตัวแปรและ f-strings
- `___BLANK_1___` : `Lumina` *(ใส่แต่คำได้เลยเพราะมี `""` ครอบไว้ให้ในโจทย์แล้ว)*
- `___BLANK_2___` : `{wizard_name}`

### 1-3: The Echo Chamber (Challenge)
**แนวคิด:** สร้างตัวแปรและใช้ print f-string ด้วยตัวเอง
```python
spell_name = "Fireball"
power = 100
print(f"{spell_name} has {power} power")
```

### 1-4: Broken Runes (Debug)
**แนวคิด:** แก้ Bug 3 จุด (ลืมใส่ `""` ครอบ string, และปิดวงเล็บ f-string ไม่ครบ)
```python
wizard = "Lumina"
spell = "Fireball"

print(f"The wizard {wizard} casts {spell}!")
```

### 1-5: The Prism Path (Lesson)
**แนวคิด:** เรียกใช้ function ของ hero เพื่อผสมสี RGB (สีแดงบริสุทธิ์)
```python
hero.cast_color(255, 0, 0)
```

### 1-6: Color Alchemy (Guided)
**แนวคิด:** ผสมสีเหลือง (แดง + เขียว) และสั่งเดิน
- `___BLANK_1___` (Red) : `255`
- `___BLANK_2___` (Green) : `255`
- `___BLANK_3___` (Blue) : `0`
- `___BLANK_4___` (Move) : `2`

### 1-7: The Shifting Bridge (Challenge)
**แนวคิด:** เขียนหลายคำสั่งต่อเนื่องกัน (ลำดับความสำคัญ)
```python
hero.move_to_x(3)
hero.cast_color(0, 0, 255)
```

### 1-8: The Forest Guardian (Boss)
**แนวคิด:** นำสิ่งที่เรียนมาทั้งหมดในด่านก่อนหน้ามารวมกัน
```python
phrase = "Gate of the Forest"

hero.move_to_x(5)
hero.cast_color(0, 255, 0)
print(f"Open, {phrase}!")
```

---

## 📜 Region 2: THE SCHOLAR'S ARCHIVE

### 2-1: The Essence of Values (Lesson)
**แนวคิด:** ประกาศตัวเลข (Integer)
```python
magic_number = 42
print(magic_number)
```

### 2-2: The Type Checker (Guided)
**แนวคิด:** เช็คชนิดของข้อมูลด้วยฟังก์ชัน `type()`
- `___BLANK_1___` : `type(number)`
- `___BLANK_2___` : `type(word)`

### 2-3: Mixed Potions (Debug)
**แนวคิด:** แก้ Bug ตัวแปรคนละประเภทที่ไม่สามารถบวกกันได้ (Type Error)
```python
# แปลงเป็น int ตั้งแต่ต้น หรือเอา "" ออก
base_power = 50
boost = 25

total = base_power + boost
# แปลงกลับเป็น string ก่อนนำไปต่อกับข้อความ
print("Total: " + str(total))
```

### 2-4: The Transmuter (Challenge)
**แนวคิด:** การแปลงชนิดข้อมูล `str` เป็น `int` แล้วนำไปคำนวณ
```python
value_str = "255"

value_int = int(value_str)
result = value_int * 2
print(result)
```

### 2-5: Rune Arithmetic (Puzzle)
**แนวคิด:** ตอบคำถามช้อยส์เกี่ยวกับคณิตศาสตร์ใน Python
1. `10 + 5 * 2` คำตอบคือ **20** *(ทำคูณก่อนบวก)*
2. `17 // 5` คำตอบคือ **3** *(หารปัดเศษลง)*
3. `17 % 5` คำตอบคือ **2** *(หารเอาเศษ modulo)*
4. `2 ** 3` คำตอบคือ **8** *(ยกกำลัง)*

### 2-6: The Archive Exam (Boss)
**แนวคิด:** แปลง String → Int, บวกกัน, และ Print ผลลัพธ์พร้อมบอก Type
```python
a_str = "100"
b_str = "50"

a = int(a_str)
b = int(b_str)

total = a + b
print(f"The sum is {total} (type: {type(total)})")
```

---

## ⛰️ Region 3: ASH PEAKS

### 3-1: The Inscription Wall (Lesson)
**แนวคิด:** สร้าง List พื้นฐาน
```python
elements = ["Fire", "Water", "Earth"]
print(elements)
```

### 3-2: Rune Positions (Guided)
**แนวคิด:** เข้าถึงตำแหน่งใน List (Zero-indexed)
- `___BLANK_1___` (ช่องแรก) : `0`
- `___BLANK_2___` (ช่องสาม) : `2`
- `___BLANK_3___` (ช่องสุดท้าย) : `-1` *(หรือ 3 ก็ได้)*

### 3-3: The Matrix Search (Challenge)
**แนวคิด:** ค้นหาตำแหน่ง Index ของข้อมูลใน List แล้วเดินไปจุดนั้น
```python
values = [10, 25, 46, 80]

idx = values.index(46)
hero.move_to_x(idx)
```

### 3-4: The Echo Loop (Lesson)
**แนวคิด:** ใช้ for-loop เพื่อวนลูปอ่านค่าใน List
```python
values = [10, 20, 30, 40]

for val in values:
    print(val)
```

### 3-5: Broken Arrays (Debug)
**แนวคิด:** แก้ไข Syntax Error (ลืมใส่ `:` ของ loop) และตัวแปรผิด
```python
items = ["sword", "shield", "potion"]

# ลืมใส่ colon : ด้านหลัง items
for item in items:
    print(item)

# ต้องวัดขนาดของตัวแปร list (items) ไม่ใช่ตัวแปร loop (item)
print(f"Total items: {len(items)}")
```

### 3-6: The Peak Trial (Boss)
**แนวคิด:** รวมทักษะ Lists, หา Index, วน Loop, เคลื่อนที่
```python
values = [10, 25, 46, 80, 99]

idx = values.index(46)

for v in values:
    print(v)

hero.move_to_x(idx)
```

---

## 🦇 Region 4: WHISPERING CAVERNS

### 4-1: The Crossroads (Lesson)
**แนวคิด:** คำสั่ง if/else เงื่อนไขแบบมี 2 ทางเลือก
```python
power = 150

if power > 100:
    print("Powerful")
else:
    print("Weak")
```

### 4-2: Path Selection (Guided)
**แนวคิด:** คำสั่งเงื่อนไขหลายทางเลือก if/elif/else
- `___BLANK_1___` : `>` *(หรือ `>=`)*
- `___BLANK_2___` : `elif`
- `___BLANK_3___` : `else`

### 4-3: Truth and Lies (Puzzle)
**แนวคิด:** ตรรกศาสตร์ Boolean (True/False, And/Or/Not)
1. `True and False` คำตอบคือ **False**
2. `True or False` คำตอบคือ **True**
3. `not True` คำตอบคือ **False**
4. `(5 > 3) and (10 < 20)` คำตอบคือ **True**

### 4-4: Broken Bridges (Debug)
**แนวคิด:** แก้ปัญหา Syntax Error ยอดฮิต: ลืมใส่ `:` ห้อยท้ายเงื่อนไข
```python
weight = 50
max_weight = 100

if weight < max_weight:
    print("Bridge is safe!")
else:
    print("Too heavy!")
```

### 4-5: The Color Mixer (Challenge)
**แนวคิด:** ใช้ if/elif/else มาควบคุมสีที่จะแคสต์ตามตัวแปร
```python
command = "green"

if command == "red":
    hero.cast_color(255, 0, 0)
elif command == "green":
    hero.cast_color(0, 255, 0)
elif command == "blue":
    hero.cast_color(0, 0, 255)
else:
    hero.cast_color(255, 255, 255)
```

### 4-6: The Light Convergence (Boss)
**แนวคิด:** รวมเงื่อนไข, Boolean (`and`), ตัวแปร, และฟังก์ชันเพื่อเคลียร์เกม
```python
red = 255
green = 255
blue = 255

if red == 255 and green == 255 and blue == 255:
    hero.cast_color(red, green, blue)
    print("The Lost Spectrum is restored!")
```
