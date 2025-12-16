
# Job Application Tracker API

A role-based REST API for managing job applications with controlled workflow transitions, audit history, and asynchronous email notifications.
---
## 🚀 Project Overview
This project implements a backend system for tracking job applications. It enforces role-based access control (RBAC), validates application stage transitions using a workflow state machine, maintains a complete audit trail, and sends email notifications on stage changes without blocking API responsiveness.
---
## ✨ Features

- JWT-based authentication
- Role-Based Access Control (Candidate / Recruiter)
- Controlled application workflow state machine
- Audit trail for stage changes (ApplicationHistory)
- Asynchronous email notifications
- MongoDB persistence using Mongoose
- Clean MVC architecture

---

## 👥 Roles & Permissions

### Candidate
- Create job applications
- View own job applications
- Update application details (except stage)
- Delete own job applications

### Recruiter
- Change application stage only

---

## 🔄 Application Workflow

Valid stage transitions:

```

Applied → Shortlisted → Interview → Offer → Hired
↘ Rejected

``
Invalid transitions are blocked automatically.

---

## 🔐 Authentication

All protected routes require a JWT token:

```
Authorization: Bearer <token>

## 📌 API Endpoints

### Create Job Application (Candidate)

**POST** `/api/jobApplications`

**Request Body**
```json
{
  "title": "Software Engineer",
  "company": "Google"
}
````
---
### Get Job Applications (Candidate)

**GET** `/api/jobApplications`
---
### Update Job Application (Candidate)

**PUT** `/api/jobApplications/:id`

⚠️ Stage updates are not allowed through this endpoint.

---

### Delete Job Application (Candidate)

**DELETE** `/api/jobApplications/:id`

---
### Change Application Stage (Recruiter only)
**PATCH** `/api/jobApplications/:id/stage
**Request Body**
```json
{
  "stage": "Interview"
}
```
✔ Validates workflow rules
✔ Logs audit history
✔ Sends email notification asynchronously
---
## 🕵️ Audit Trail (ApplicationHistory)

Every stage change is stored with:

* Job application ID
* Previous stage
* New stage
* Changed by (user ID)
* Timestamp

This ensures a complete and accurate audit history.
---
## ✉️ Email Notifications

* Triggered when application stage changes
* Implemented using Nodemailer
* Sent asynchronously so API remains responsive
* Uses test SMTP (Ethereal / Mailtrap)
* Ready for real SMTP integration (Gmail)
---
## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobTracker
JWT_SECRET=your_jwt_secret

EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```
---
## ▶️ Running the Project

```bash
npm install
node src/app.js
```

Server will run at:

```
http://localhost:3000
```
---
## 🧪 Testing
* Use Postman or curl
* Candidate token for CRUD operations
* Recruiter token for stage transitions
## 🏗️ Project Structure

job-application-tracker/
│
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   └── utils/
│
├── .env.example
├── package.json
└── README.md
## 🔮 Future Enhancements
* Background job queue (Bull / RabbitMQ) for emails
* Admin dashboard
* Pagination and filtering
## ✅ Expected Outcomes Status
✔ Fully functional REST API
✔ Workflow state machine
✔ Audit trail for stage changes
✔ Role-based access control
✔ Responsive API
✔ Comprehensive documentation
---
## 👨‍💻 Author
**24A95A0501**
**Lakshmi Susmitha**
CSE – 3rd Year
````
