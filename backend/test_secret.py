# วิธีสร้าง secret key แบบสุ่ม
import secrets
print(secrets.token_hex(32))  # รันคำสั่งนี้แล้วเอาค่าที่ได้ไปใส่