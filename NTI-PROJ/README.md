# Gym Management System — Backend API

باك إند كامل بـ Node.js + Express + MongoDB لنظام إدارة جيم.

## المتطلبات المغطّاة

| المطلوب | فين تلاقيه |
|---|---|
| MongoDB Atlas + الاتصال بالكود | `src/config/db.js` |
| ملف `.env` | `.env.example` (تعمل منه نسخة اسمها `.env`) |
| Schema & Models | `src/models/` — 3 موديلز |
| CRUD كامل | `src/controllers/class.controller.js` + `trainer.controller.js` |
| Multer للصور | `src/middlewares/upload.middleware.js` |
| Users & Roles | `src/models/user.model.js` (`role: admin \| member`) |
| Bcrypt للباسورد | `user.model.js` — `pre('save')` + `comparePassword()` |
| JWT | `src/utils/jwt.js` |
| Authentication | `protect` في `auth.middleware.js` |
| Authorization | `restrictTo('admin')` في `auth.middleware.js` |

---

## التشغيل خطوة خطوة

### 1. نزّل الباكدجز
```bash
npm install
```

### 2. اعمل ملف `.env`
انسخ `.env.example` وسمّي النسخة `.env`، وبعدين حط فيه الـ connection string بتاع Atlas.

### 3. املأ الداتابيز ببيانات تجريبية (اختياري بس مفيد)
```bash
npm run seed
```
هيعملك:
- أدمن: `admin@gym.com` / `admin12345`
- عضو: `member@gym.com` / `member12345`
- 4 مدربين و 6 حصص

### 4. شغّل السيرفر
```bash
npm run dev
```
هيشتغل على `http://localhost:5000`

---

## الـ API Endpoints

### Auth — `/api/v1/auth`
| Method | Route | الصلاحية | الوظيفة |
|---|---|---|---|
| POST | `/signup` | عام | تسجيل عضو جديد (multipart، فيلد الصورة اسمه `imageUrl`) |
| POST | `/signin` | عام | تسجيل دخول → يرجّع `token` |
| GET | `/me` | مسجّل دخول | بيانات المستخدم الحالي |

### Classes — `/api/v1/classes`
| Method | Route | الصلاحية | الوظيفة |
|---|---|---|---|
| GET | `/` | عام | كل الحصص — يدعم `?category=yoga&level=beginner&search=xx` |
| GET | `/:id` | عام | حصة واحدة |
| POST | `/` | **admin** | إضافة حصة |
| PATCH | `/:id` | **admin** | تعديل حصة |
| DELETE | `/:id` | **admin** | حذف حصة |

### Trainers — `/api/v1/trainers`
نفس الشكل بالظبط (GET عام، والباقي admin).

### Users — `/api/v1/users`
| Method | Route | الصلاحية | الوظيفة |
|---|---|---|---|
| GET | `/classes` | مسجّل دخول | حصص العضو الحالي |
| POST | `/classes` | مسجّل دخول | اشتراك في حصة — `{ "classId": "..." }` |
| DELETE | `/classes/:classId` | مسجّل دخول | إلغاء اشتراك |
| GET | `/` | **admin** | كل الأعضاء |
| PATCH | `/:id/role` | **admin** | تغيير الدور |
| DELETE | `/:id` | **admin** | حذف عضو |

### شكل الـ Response
```json
{ "status": "success", "data": { "classes": [ ... ] } }
```
وفي حالة الخطأ:
```json
{ "status": "fail", "message": "..." }
```

### الصور
بتتحفظ في فولدر `uploads/` وبتترجع كـ path زي `/uploads/1234-567.jpg`.
في الفرونت تعرضها كده: `http://localhost:5000` + الـ path.
