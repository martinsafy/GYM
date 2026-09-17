# MongoDB Atlas — شرح من الصفر

## يعني إيه Atlas أصلاً؟

MongoDB هي قاعدة البيانات. عندك طريقتين تستخدمها:
1. **تنزّلها على جهازك** — بتشتغل على جهازك بس، ولو غيّرت جهاز البيانات تروح.
2. **Atlas** — نفس القاعدة بس شغالة على سيرفر على النت (سحابة) مجاناً. أي حد عنده اللينك يقدر يوصلها من أي مكان.

**Atlas = MongoDB مستضافة على النت.** والدكتور طالبها لأنها بتخلّي البروجكت شغّال من أي جهاز.

---

## الخطوات

### 1. اعمل حساب
ادخل على **mongodb.com/cloud/atlas/register** واعمل تسجيل بالإيميل (مجاني تماماً، مش هيطلب منك كارت).

### 2. اعمل Cluster
- بعد التسجيل هيسألك تختار خطة → اختار **M0 / Free** (المجانية).
- Provider: خليه AWS. Region: اختار أقرب حاجة ليك (مثلاً Frankfurt أو Ireland).
- اضغط **Create Deployment**. الإنشاء بياخد 1-3 دقايق.

### 3. اعمل يوزر لقاعدة البيانات
غالباً هيطلبه منك على طول في شاشة "Connect to your cluster":
- Username: مثلاً `gymAdmin`
- Password: اضغط **Autogenerate** و**انسخ الباسورد في مكان آمن** — مش هيظهرلك تاني.
- اضغط **Create Database User**.

> لو الشاشة عدّت منك: من القائمة الشمال → **Database Access** → **Add New Database User**.

### 4. افتح الشبكة (أهم خطوة)
من القائمة الشمال → **Network Access** → **Add IP Address** → اضغط **ALLOW ACCESS FROM ANYWHERE**
(هيحط `0.0.0.0/0`) → **Confirm**.

> لو نسيت الخطوة دي، الكود هيفضل يديك إيرور اسمه
> `MongooseServerSelectionError: Could not connect to any servers`

### 5. هات الـ Connection String
- من القائمة الشمال → **Database** (أو Clusters)
- اضغط زرار **Connect** جنب اسم الكلستر
- اختار **Drivers**
- Driver: **Node.js**، Version: أحدث نسخة
- هيطلعلك سطر شكله كده — **انسخه**:

```
mongodb+srv://gymAdmin:<db_password>@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 6. عدّل السطر ده قبل ما تحطه في `.env`
حاجتين لازم تعملهم:

**أ) بدّل `<db_password>` بالباسورد الحقيقي** (من غير الأقواس `<>`)

**ب) حط اسم الداتابيز بعد `.net/`** وقبل علامة `?`:

```
mongodb+srv://gymAdmin:MyRealPass123@cluster0.ab1cd.mongodb.net/gym-db?retryWrites=true&w=majority
```
                                                                      ^^^^^^ 
                                                            اسم الداتابيز هنا

### 7. حطه في ملف `.env`
```
MONGODB_URI=mongodb+srv://gymAdmin:MyRealPass123@cluster0.ab1cd.mongodb.net/gym-db?retryWrites=true&w=majority
```

> **مهم:** لو الباسورد بتاعك فيه رموز زي `@` أو `#` أو `/`، هتبوّظ اللينك.
> الحل: ارجع لـ Database Access وغيّر الباسورد لحاجة حروف وأرقام بس.

---

## تتأكد إزاي إن كل حاجة تمام؟

شغّل السيرفر:
```bash
npm run dev
```

لو شفت السطر ده يبقى تمام:
```
MongoDB connected: cluster0-shard-00-01.xxxxx.mongodb.net
Server is running on http://localhost:5000
```

وبعدين افتح `http://localhost:5000` في المتصفح — المفروض تلاقي:
```json
{"status":"success","message":"Gym Management API is running"}
```

---

## تشوف البيانات بعينك إزاي؟

في Atlas: **Database** → **Browse Collections**.
هتلاقي الداتابيز `gym-db` وجوّاها الـ collections: `users`، `gymclasses`، `trainers`.

أو من VS Code: نزّل إكستنشن **MongoDB for VS Code** وحط نفس الـ connection string.

---

## أشهر المشاكل وحلّها

| الإيرور | السبب | الحل |
|---|---|---|
| `Could not connect to any servers` | الـ IP مش مسموح | Network Access → Allow from anywhere |
| `bad auth : authentication failed` | اليوزر أو الباسورد غلط | تأكد إنك بدّلت `<db_password>` بالباسورد الفعلي |
| `MONGODB_URI is missing` | ملف `.env` مش موجود أو الاسم غلط | لازم يبقى اسمه `.env` بالظبط وفي الفولدر الرئيسي |
| `Invalid scheme` | نقصت جزء من اللينك | لازم يبدأ بـ `mongodb+srv://` |
