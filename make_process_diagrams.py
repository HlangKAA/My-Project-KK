import glob, html, os, subprocess, tempfile
from pathlib import Path
from PIL import Image

ROOT=Path.cwd(); OUT=ROOT/'documents'/'process_diagrams'; OUT.mkdir(parents=True,exist_ok=True)
W,H=1800,1000
data=[
('DFD_Process_1_Register','Process 1: สมัครสมาชิก', 'ผู้เล่นส่ง name, email, password; Frontend ตรวจ confirm password', 'POST /api/signup • ตรวจข้อมูล • hash password • บันทึกบัญชี', [('D1: players','INSERT: username, email, password, token'),('E2: Email','ส่ง verification link')], 'หมายเหตุ: is_verified ถูกตั้ง TRUE ตอนสมัคร จึงไม่บังคับเปิดลิงก์ก่อน Login'),
('DFD_Process_2_Login','Process 2: เข้าสู่ระบบ', 'ผู้เล่นส่ง email และ password', 'POST /api/login • ตรวจ password hash • สร้าง Flask session', [('D1: players','อ่านบัญชี; อัปเดต last_login'),('D2: game_progress','อ่าน XP / current region'),('D3: code_submissions + achievements','อ่านด่านผ่าน / achievements')], 'หลัง Login Frontend เรียก /api/user และ /api/progress เพื่อคืนค่าบัญชีและความคืบหน้า'),
('DFD_Process_3_Reset_Password','Process 3: รีเซ็ตรหัสผ่าน', 'ผู้เล่นส่ง email เพื่อขอลิงก์รีเซ็ต', 'Forgot Password / Reset Password • ตรวจ token และอายุ 1 ชั่วโมง', [('D1: players','อ่าน email; เขียน reset_token/expiry'),('E2: Email','ส่ง reset link'),('D1: players','อัปเดตรหัสผ่านแบบ hash; ล้าง reset token')], 'ระบบใช้ reset link ไม่ใช่ OTP; เมื่อสำเร็จกลับไป Login'),
('DFD_Process_4_Select_Stage','Process 4: เลือกภูมิภาคและด่าน', 'ผู้เล่นเลือกจาก Dashboard / RegionMap', 'Frontend เลือก REGION และ stage จาก stageData.js', [('D1: Frontend stage catalog','อ่านข้อมูลภูมิภาค / โจทย์ / stage_key'),('D2: game_progress + code_submissions','GET /api/progress อ่านสถานะที่บันทึกไว้')], 'levels.level_id ไม่ได้ใช้แสดงแผนที่; ใช้จับคู่ stage_key ตอนส่งคำตอบ'),
('DFD_Process_5_Run_Submit','Process 5: รันโค้ดและส่งคำตอบ', 'ผู้เล่นเขียนโค้ด Python', 'Skulpt รันในเบราว์เซอร์; Frontend ตรวจผล แล้ว POST /api/submissions', [('D1: levels','ค้น level_id จาก stage_key'),('D2: code_submissions','บันทึก code, result, runtime, submitted_at'),('D3: player_stats + game_logs','บันทึกสถานะ/เหตุการณ์ของ attempt')], 'บันทึกทั้ง Success, Fail และ Error; Backend จัดเก็บผล ไม่ได้รันหรือประเมินโค้ดซ้ำ'),
('DFD_Process_6_Progress','Process 6: บันทึกความสำเร็จและความคืบหน้า', 'ผล Success จาก Process 5', 'Backend คำนวณ XP; อัปเดตความก้าวหน้าของผู้เล่น', [('D1: game_progress','อัปเดต current_level, last_played, high_score'),('D2: achievements','อ่านเงื่อนไขรางวัล'),('D3: player_achievements','บันทึกรางวัลที่ปลดล็อก')], 'XP ให้เฉพาะการผ่านด่านครั้งแรก; bonus ตามการลองครั้งแรกและการไม่ใช้ hint; ส่ง progress กลับ Frontend'),
('DFD_Process_7_Logout','Process 7: ออกจากระบบ', 'ผู้เล่นกด Logout', 'POST /api/logout • session.clear(); Frontend ตั้ง user เป็น null', [('D1: Flask session','ล้างข้อมูล session'),('ข้อมูล Supabase','ไม่ลบ progress, submissions หรือ achievements')], 'ผู้เล่นกลับสู่สถานะยังไม่เข้าสู่ระบบ; ข้อมูลเกมในฐานข้อมูลยังคงอยู่'),
]

def wrap(s, limit):
    words=s.split(); out=[]; line=''
    for word in words:
        if len(word)>limit:
            if line: out.append(line); line=''
            out.extend(word[i:i+limit] for i in range(0,len(word),limit)); continue
        if line and len(line)+1+len(word)>limit: out.append(line); line=word
        else: line=(line+' '+word).strip()
    if line: out.append(line)
    return out or ['']

def t(x,y,lines,size=27,color='#26364e',weight=500,anchor='middle'):
    if isinstance(lines,str): lines=wrap(lines,42 if size<=22 else 32)
    out=[f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="Leelawadee UI,Tahoma,sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">']
    for i,s in enumerate(lines): out.append(f'<tspan x="{x}" dy="{0 if i==0 else 36}">{html.escape(s)}</tspan>')
    out.append('</text>'); return ''.join(out)

def box(x,y,w,h,title,body,fill='#fff',stroke='#6980a5',radius=22):
    bodylines=wrap(body,max(16,int((w-36)/14)))
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'+t(x+w/2,y+46,[title],25,'#1d2c44',700)+t(x+w/2,y+91,bodylines,20,'#4d5d75',450)

def render(item,edge):
    name,title,source,proc,targets,note=item
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><marker id="a" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0L12 6L0 12Z" fill="#77869c"/></marker></defs><rect width="100%" height="100%" fill="#f4f7fc"/>']
    svg.append(t(900,78,['THE LOST SPECTRUM • DATA FLOW DIAGRAM'],24,'#318b83',700))
    svg.append(t(900,145,[title],43,'#172842',750))
    svg.append('<rect x="55" y="210" width="1690" height="650" rx="30" fill="#eef3f9" stroke="#dce4ef" stroke-width="2"/>')
    # input entity, process bubble, and stores
    svg.append(box(95,385,325,170,'External Entity',source,'#e9f0ff','#6684bd'))
    svg.append('<ellipse cx="830" cy="470" rx="330" ry="190" fill="#fff" stroke="#428e88" stroke-width="4"/>')
    svg.append(t(830,410,['Process'],24,'#318b83',650)); svg.append(t(830,452,wrap(proc.split(' • ')[0],32),24,'#1c304c',700))
    details=proc.split(' • ')[1:]
    if details: svg.append(t(830,505,[line for item in details for line in wrap(item,42)],20,'#52627a',450))
    svg.append(f'<path d="M420 470H490" stroke="#77869c" stroke-width="4" marker-end="url(#a)"/>')
    svg.append(t(455,446,['data'],17,'#77869c',500))
    ys=[280,470,660] if len(targets)>2 else ([350,600] if len(targets)==2 else [470])
    for idx,(store,desc) in enumerate(targets):
        y=ys[idx]; svg.append(box(1270,y,390,150,store,desc,'#fff9eb','#d1a24b'))
        # Flow directions: stores with lookup/read descriptions feed process; writes receive process output.
        read=any(word in desc.lower() for word in ['อ่าน','อ่านบัญชี','ค้น','อ่านเงื่อนไข'])
        if read:
            svg.append(f'<path d="M1270 {y+75}H1165V470H1160" fill="none" stroke="#77869c" stroke-width="3" marker-end="url(#a)"/>')
        else:
            svg.append(f'<path d="M1160 470H1205V{y+75}H1270" fill="none" stroke="#77869c" stroke-width="3" marker-end="url(#a)"/>')
    svg.append('<rect x="95" y="890" width="1565" height="68" rx="18" fill="#fff7e8" stroke="#e3c27e" stroke-width="2"/>')
    svg.append(t(130,933,[note],20,'#745a27',550,'start'))
    svg.append(t(900,990,['Source of truth: current Frontend + Flask routes + Supabase public schema'],17,'#7b879a',450))
    svg.append('</svg>')
    html_doc='<html><head><meta charset="utf-8"><style>html,body{margin:0;width:1800px;height:1000px;overflow:hidden}svg{display:block}</style></head><body>'+''.join(svg)+'</body></html>'
    with tempfile.TemporaryDirectory(prefix='dfd-',dir=ROOT) as tmp:
        p=Path(tmp); page=p/'page.html'; page.write_text(html_doc,encoding='utf8')
        subprocess.run([edge,'--headless','--disable-gpu','--no-sandbox','--hide-scrollbars',f'--user-data-dir={p/"profile"}',f'--window-size={W},{H}',f'--screenshot={OUT/(name+".png")}','--virtual-time-budget=800',page.as_uri()],check=True,timeout=30,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

def main():
    edge=glob.glob(r'C:\Program Files (x86)\Microsoft\Edge\Application\*\msedge.exe')[-1]
    for item in data: render(item,edge)
    # The overall flowchart was created and reviewed alongside this DFD set.
    src=ROOT/'documents'/'workflow_actual.png'; dst=OUT/'Flowchart_Overall.png'
    dst.write_bytes(src.read_bytes())
    for p in OUT.glob('*.png'):
        with Image.open(p) as im: im.verify()
    print(f'Created {len(data)} process DFDs and 1 overall flowchart in {OUT}')

if __name__=='__main__': main()
