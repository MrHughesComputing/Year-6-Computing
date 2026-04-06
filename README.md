# APSR Year 6 Computing App

This application is a browser-based computing platform designed for use at **Aldenham Prep School Riyadh**.

It delivers a structured **Year 6 computing curriculum** focused on **selection, logic, and quiz-based project development**, through interactive lessons, quizzes, and progress tracking.

---

## 🚀 Core Features

* Pupil login system (localStorage-based)
* Class grouping:

  * Year 6 Elder
  * Year 6 Juniper
  * Year 6 Walnut

---

### 📚 Structured Lesson Delivery

Each lesson includes:

* Key Question
* Common Misconceptions
* Success Criteria (implicit through outcomes)
* Teaching Content (guided explanation)
* Step-by-step practical guide (Scratch)
* Scratch task (applied learning)

---

### 🧠 Curriculum Focus

The Year 6 curriculum builds progression in:

* Conditions (true / false logic)
* Selection (if / then / else)
* Combining selection with loops
* User input (ask / answer)
* Planning algorithms
* Debugging logic
* Building a multi-question quiz project

---

### 🧪 Assessment System

* 10-question quizzes per lesson
* Randomised answer order (persisted per pupil)
* Correct answer mapping maintained
* Score calculated on submission
* Immediate feedback provided
* No retakes (assessment integrity)

---

### 📸 Evidence of Learning

* Screenshot upload per lesson
* Stored locally in browser
* Allows pupils to evidence Scratch work

---

### 📊 Progress Tracking

* Lesson completion tracking
* Progress percentage displayed
* Quiz completion recorded
* Data stored per pupil

---

### 👨‍🏫 Teacher Dashboard

* Password protected access
* View all pupils on device
* Class-based filtering
* Progress indicators:

  * Good progress
  * Partial progress
  * Not started
* At-risk identification
* Ability to:

  * Reset pupil progress
  * Delete pupil data
  * Open pupil workspace

---

## 🧱 Technical Stack

* Next.js (App Router)
* TypeScript
* localStorage (no backend)
* Vercel deployment

---

## ⚠️ Important System Constraints

* All data is stored **locally in the browser**
* No cloud sync or cross-device access
* No user authentication system
* Teacher dashboard password is **not production-secure**
* Data will be lost if:

  * Browser cache is cleared
  * Device is changed

---

## 🧠 Data Architecture

Each pupil is assigned a unique storage key:

```ts
year6-{className}-{studentName}
```

This isolates:

* Progress
* Quiz results
* Quiz randomisation order
* Screenshots

---

## 👨‍🏫 Teacher Dashboard

Access via:

```bash
/teacher
```

Password:

```bash
APSR2026
```

> This is a classroom-level access control only and not a secure authentication system.

---

## 🎯 Purpose

This platform is designed to:

* Support **independent pupil learning**
* Reinforce **computational thinking**
* Provide **structured progression from Year 5**
* Enable **teacher visibility of progress**
* Align with **UK computing expectations (NCCE-informed)**

---

## 🚫 Development Constraints

* No backend integration
* No database
* No authentication system
* Must remain lightweight and classroom-ready

---

## 📌 Status

> **Version: Year 6 – V1 (Production Ready)**

* Stable
* Classroom deployable
* Inspection-aligned (COBIS / BSO context)

---

## 🔄 Future Improvements (Optional)

* Export / reporting system
* Cloud sync (long-term)
* Enhanced analytics
* Mastery-based progression indicators

---
