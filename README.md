# 🎬 MovieGo  
**Movie Seat Booking System with TMDB API and Next.js**

Link Demo [Link Youtube](https://youtu.be/9180jmIUZQ8)

## 📖 โปรเจกต์เกี่ยวกับอะไร?  
MovieGo เป็นเว็บไซต์สำหรับ **ดูข้อมูลภาพยนตร์และจองที่นั่งโรงภาพยนตร์**  
โดยใช้ **TMDB API** เพื่อดึงข้อมูลภาพยนตร์ เช่น  
- รายละเอียดภาพยนตร์  
- คะแนนรีวิว  
- รายชื่อภาพยนตร์ที่กำลังมาแรง

## วัตถุประสงค์  
- ให้ผู้ใช้สามารถ **ค้นหาและจองที่นั่งภาพยนตร์** ได้ง่าย  
- รองรับ **การยืนยันตัวตนที่ปลอดภัย** ผ่าน **JWT**  
- อัปเดตที่นั่งแบบ **เรียลไทม์** ด้วย **WebSocket**  
- รองรับ **ระบบชำระเงิน** ผ่าน **Stripe API**  
- ให้ผู้ดูแลระบบสามารถ **จัดการโรงภาพยนตร์และรอบฉาย** ได้  

---

## 🚀 **ฟีเจอร์หลักของเว็บไซต์**  

### ** ฝั่งผู้ใช้ (User)**
1. **ระบบการเข้าสู่ระบบ (Login/Signup)**  
   - สมัครสมาชิก / เข้าสู่ระบบ  

2. **แสดงข้อมูลภาพยนตร์ (View Movie Information)**  
   - ดึงข้อมูลจาก TMDB API  
   - แสดงรายละเอียดภาพยนตร์, นักแสดง, คะแนนรีวิว  

3. **ค้นหาภาพยนตร์ (Search Movies)**  
   - ค้นหาภาพยนตร์ตามชื่อ  

4. **ดูประวัติการจอง (View Booking History)**  
   - แสดงรายการจองที่เคยทำ  

5. **ระบบจองที่นั่ง (Book a Seat)**  
   - เลือกโรงภาพยนตร์, รอบฉาย, และที่นั่ง  

6. **การชำระเงิน (Payment Processing - Stripe API)**  
   - รองรับบัตรเครดิต/เดบิต และ e-Wallet  
   - ต้องชำระเงินก่อน การจองจึงสำเร็จ  

7. **แก้ไขข้อมูลโปรไฟล์ (Edit Profile)**  
   - อัปเดตชื่อ, อีเมล, รหัสผ่าน  

---

### ** ฝั่งแอดมิน (Admin)**
1. **จัดการข้อมูลโรงภาพยนตร์ (Manage Cinema Data)**  
   - เพิ่ม / แก้ไข / ลบ โรงภาพยนตร์  

2. **เพิ่มและจัดการเวลาฉายภาพยนตร์ (Manage Movie Showtimes)**  
   - ตั้งค่ารอบฉายของแต่ละโรง  

---

## 📌 **Use Case Diagram**  
![Use Case Diagram](image/usecase.svg)

---

## 🔧 3. คำแนะนำในการติดตั้ง (Installation Guide)

1.ดาวน์โหลดและเข้าไปในโฟลเดอร์ของโปรเจกต์  
```bash
git clone https://github.com/amesupakorn/MovieGo.git
cd MovieGo
```
2.ติดตั้ง Dependencies
```bash
pnpm install
```
3.ติดตั้งและตั้งค่า Prisma
   - 3.1ติดตั้ง Prisma
  ```bash
  npx prisma init
  ```
   - 3.2ตั้งค่าการเชื่อมต่อฐานข้อมูลใน .env
  ```bash
  DATABASE_URL=postgresql://user:password@localhost:5432/movieGo
  ```
   - 3.3รัน Prisma Migrate (สร้างตารางฐานข้อมูล)
  ```bash
  pnpm prisma migrate dev --name update
  pnpm prisma generate
  ```
4.รันโปรเจกต์
```bash
pnpm run dev
```
📌 เปิดเบราว์เซอร์และเข้าไปที่ 
สำหรับหน้า CLient | http://localhost:3000/client/home 
สำหรับหน้า Admin  | http://localhost:3000/admin

---

## 🛠 เทคโนโลยีที่ใช้  

**Frontend** 
- Next.js - React Framework  
- Tailwind CSS - ใช้สำหรับ Styling  

**Backend**  
- Next.js - ใช้สร้าง API  
- Prisma ORM - จัดการฐานข้อมูล
- WebSocket - ใช้สำหรับการแจ้งเตือนแบบเรียลไทม์

**Database**  
- PostgreSQL - รองรับหลายประเภทของฐานข้อมูล  
- Prisma Migrations - ใช้จัดการโครงสร้างฐานข้อมูล  

**External APIs**  
- TMDB API - ใช้ดึงข้อมูลภาพยนตร์  
- Stripe API - ใช้สำหรับการชำระเงิน  

**Authentication**  
- JWT (JSON Web Token) - ใช้สำหรับระบบล็อกอิน / ลงทะเบียน 
