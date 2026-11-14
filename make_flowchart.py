import glob,html,subprocess,tempfile
from pathlib import Path
from PIL import Image
ROOT=Path.cwd(); OUT=ROOT/'documents'/'process_diagrams'/'Flowchart_Overall.png'; W,H=1500,2500
svg=[f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs><marker id="a" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="black"/></marker></defs><rect width="100%" height="100%" fill="white"/>
<style>text{{font-family:'Leelawadee UI',Tahoma,sans-serif;fill:#111}}.line{{fill:none;stroke:#111;stroke-width:3;marker-end:url(#a)}}</style>''']
def txt(x,y,lines,size=25):
    svg.append(f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}">')
    for i,s in enumerate(lines):svg.append(f'<tspan x="{x}" dy="{0 if i==0 else 31}">{html.escape(s)}</tspan>')
    svg.append('</text>')
def rect(cx,cy,w,h,lines,size=24):
    svg.append(f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" fill="white" stroke="black" stroke-width="3"/>');txt(cx,cy-(len(lines)-1)*15,lines,size)
def term(cx,cy,w,h,lines):
    svg.append(f'<rect x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{h/2}" fill="white" stroke="black" stroke-width="3"/>');txt(cx,cy+8,lines,25)
def para(cx,cy,w,h,lines):
    pts=f'{cx-w/2+25},{cy-h/2} {cx+w/2},{cy-h/2} {cx+w/2-25},{cy+h/2} {cx-w/2},{cy+h/2}'
    svg.append(f'<polygon points="{pts}" fill="white" stroke="black" stroke-width="3"/>');txt(cx,cy-(len(lines)-1)*15,lines,23)
def diamond(cx,cy,w,h,lines):
    svg.append(f'<polygon points="{cx},{cy-h/2} {cx+w/2},{cy} {cx},{cy+h/2} {cx-w/2},{cy}" fill="white" stroke="black" stroke-width="3"/>');txt(cx,cy-(len(lines)-1)*14,lines,23)
def path(d,label=None,lx=0,ly=0):
    svg.append(f'<path d="{d}" class="line"/>')
    if label:txt(lx,ly,[label],19)
txt(750,58,['Flowchart: การทำงานจริงของ The Lost Spectrum'],34)
# Main vertical spine
term(750,130,230,70,['เริ่มต้น'])
diamond(750,265,370,150,['มีบัญชี','ผู้ใช้แล้ว?'])
rect(260,265,310,110,['สมัครสมาชิก','hash password; ส่งลิงก์อีเมล'],21)
rect(750,445,400,110,['เข้าสู่ระบบ','ตรวจ password hash → สร้าง session'],22)
rect(750,600,420,105,['โหลดบัญชีและความคืบหน้า','GET /api/user + /api/progress'],22)
rect(750,755,430,100,['เลือกภูมิภาคและด่าน','ข้อมูลด่านจาก Frontend'],22)
diamond(750,910,390,150,['ด่านเปิดให้','เล่นหรือไม่?'])
rect(250,910,300,95,['กลับไปเลือก','ด่านที่เปิดแล้ว'],21)
rect(750,1070,460,105,['อ่านโจทย์ แล้วเขียน Python','รันด้วย Skulpt ในเบราว์เซอร์'],22)
para(750,1225,470,105,['ตรวจคำตอบที่ Frontend','ส่งผลไป Backend'])
diamond(750,1395,390,150,['ผลการตรวจ','เป็น Success?'])
rect(230,1395,310,105,['แสดง error / hint','แก้โค้ดแล้วลองใหม่'],21)
rect(750,1565,500,115,['บันทึกทุก attempt','code_submissions, player_stats, game_logs'],21)
rect(750,1740,500,115,['เมื่อ Success: อัปเดต progress','XP เฉพาะ first clear; achievements'],21)
diamond(750,1920,390,150,['มีด่านถัดไป','หรือไม่?'])
rect(1120,1920,300,100,['กลับแผนที่','หรือเล่นซ้ำ'],21)
rect(750,2085,450,105,['ออกจากระบบ','ล้าง session; ข้อมูลเกมยังอยู่'],22)
term(750,2240,230,70,['สิ้นสุด'])
# Main sequence arrows
for a,b in [(165,190),(340,390),(500,548),(652,705),(805,835),(985,1017),(1122,1158),(1277,1320),(1470,1507),(1623,1682),(1798,1845),(1995,2032),(2138,2205)]:path(f'M750 {a} V{b}')
# Branch: no account -> register -> login
path('M565 265 H415', 'ไม่มี', 470,250);path('M260 320 V445 H550')
path('M935 265 H1125 V445 H950','มี',1050,250)
# Reset-password branch from login to token link then back
rect(1280,445,300,110,['ลืมรหัสผ่าน','ส่ง reset link ทางอีเมล'],20)
rect(1280,600,300,110,['ตั้งรหัสผ่านใหม่','token หมดอายุ 1 ชั่วโมง'],20)
path('M950 445 H1125 V445 H1130');path('M1280 500 V545');path('M1130 600 H1080 V445 H950','กลับ Login',1020,585)
# Locked stage branch returns to selection
path('M555 910 H400','ไม่เปิด',465,895);path('M250 862 V755 H535')
# Failed result loops back to code editor
path('M555 1395 H385','ไม่ผ่าน',465,1380);path('M230 1342 V1070 H520','ลองใหม่',410,1060)
# Successful result continues into persistence
path('M750 1470 V1507','ผ่าน',800,1495)
# No next stage routes to map/replay and logout; Yes loops to select stage
path('M945 1920 H970','ไม่มี',960,1905);path('M1120 1870 V755 H970','กลับแผนที่',1050,1825)
path('M555 1920 H500 V755 H535','มีด่านถัดไป',430,1885)
# Footnote about verification behavior
svg.append('<rect x="70" y="2340" width="1360" height="105" fill="white" stroke="black" stroke-width="2"/>')
txt(750,2377,['หมายเหตุ: signup ตั้ง is_verified = TRUE; Login ไม่บังคับเปิดลิงก์ยืนยันอีเมล'],21)
txt(750,2412,['Backend บันทึกผลที่ Frontend ส่งมา ไม่ได้รันหรือตรวจโค้ดซ้ำ'],21)
svg.append('</svg>')
doc='<html><head><meta charset="utf-8"><style>html,body{margin:0;width:1500px;height:2500px;overflow:hidden}svg{display:block}</style></head><body>'+''.join(svg)+'</body></html>'
def main():
 edge=glob.glob(r'C:\Program Files (x86)\Microsoft\Edge\Application\*\msedge.exe')[-1]
 with tempfile.TemporaryDirectory(prefix='flowchart-',dir=ROOT) as td:
  p=Path(td);f=p/'diagram.html';f.write_text(doc,encoding='utf8')
  subprocess.run([edge,'--headless','--disable-gpu','--no-sandbox','--hide-scrollbars',f'--user-data-dir={p/"profile"}',f'--window-size={W},{H}',f'--screenshot={OUT}','--virtual-time-budget=800',f.as_uri()],check=True,timeout=30,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 with Image.open(OUT) as im: im.verify()
 print(OUT)
if __name__=='__main__':main()
