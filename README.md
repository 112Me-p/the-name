# THE NAME — Concept 1A (GitHub Pages ready)

เว็บไซต์ต้นแบบ **THE NAME** ออกแบบแนว Cinematic Scrollytelling พร้อมหน้าแยกสำหรับแต่ละบริการ

## โครงสร้างเว็บไซต์
- `index.html` — หน้า Home: ภาพรวมแบรนด์และ 3 เส้นทาง
- `insight.html` — Full Life Map / Insight 27 หัวข้อ 5 มิติ
- `ikigai.html` — Ikigai จุดเชื่อมโยง 4 วง
- `wellness.html` — Facial Ritual, Mantra Yoga, Wellness Experience
- `assets/css/styles.css` — สไตล์และ responsive
- `assets/js/app.js` — scroll reveal, active section, mobile navigation
- `assets/img/` — ภาพหลักที่ใช้งานจริงในเว็บ
- `assets/img/optional-graphics/` — ภาพประกอบเพิ่มเติมสำหรับพัฒนารุ่นถัดไป (ยังไม่ได้ฝังเข้า HTML)
- `assets/icons/` — สัญลักษณ์ประกอบ

## ภาพประกอบเพิ่มเติมและตำแหน่งที่แนะนำ
- `choose-your-path.png`: Home — section **Three Pathways**
- `full-life-map-dimensions.png`: Insight — section **5 dimensions**
- `ikigai-four-circles.png`: Ikigai — section **Ikigai Map** (เวอร์ชันเว็บไซต์จริงควรเป็น HTML/SVG ที่กดสำรวจได้)
- `wellness-journey.png`: Wellness — section **Experience Flow**
- `signature-experiences.png`: Wellness — section **Service Comparison**

> ภาพประกอบเหล่านี้เป็นภาพนำเสนอที่มีตัวอักษรฝังอยู่ในรูป ควรใช้เพื่ออ้างอิงด้านดีไซน์ หรือแยกข้อความมาทำเป็น HTML ก่อนเผยแพร่จริง เพื่อรองรับมือถือและการเข้าถึง

## วิธีอัปโหลด GitHub
1. สร้าง **New repository** เช่น `the-name-website`
2. แตก ZIP ก่อน แล้วอัปโหลด **ไฟล์ทั้งหมดที่อยู่ข้างใน** ไปที่ root ของ repository (ต้องให้ `index.html` อยู่ root)
3. Commit changes ลง `main`
4. เข้า **Settings > Pages** → **Deploy from a branch** → เลือก `main` / `(root)` และ Save
5. เปิด URL รูปแบบ `https://USERNAME.github.io/REPOSITORY/`

## สถานะ
- เป็น **Front-end prototype** ยังไม่ใช่ระบบจองจริง
- ตรวจสอบราคา รายละเอียดบริการ ข้อมูลติดต่อ และความยินยอมใช้ภาพก่อนเผยแพร่
- ปุ่ม LINE OA ยังต้องใส่ลิงก์ที่ถูกต้องและทดสอบจริง
- รองรับการพัฒนาต่อด้วย HTML/CSS/JavaScript บน GitHub Pages
