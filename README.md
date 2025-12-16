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

Applied → Shortlisted → Interview → Offer → Hired
↘ Rejected

yaml
Copy code

Invalid transitions are blocked automatically.

---

## 🔐 Authentication

All protected routes require a JWT token:

Authorization: Bearer <token>

yaml
Copy code

---

## 📌 API Endpoints

### Create Job Application (Candidate)
POST /api/jobApplications

css
Copy code

**Request Body**
```json
{
  "title": "Software Engineer",
  "company": "Google"
}
Get Job Applications (Candidate)
bash
Copy code
GET /api/jobApplications
Update Job Application (Candidate)
bash
Copy code
PUT /api/jobApplications/:id
⚠️ Stage updates are not allowed through this endpoint.

Delete Job Application (Candidate)
bash
Copy code
DELETE /api/jobApplications/:id
Change Application Stage (Recruiter only)
bash
Copy code
PATCH /api/jobApplications/:id/stage
Request Body

json
Copy code
{
  "stage": "Interview"
}
✔ Validates workflow rules
✔ Logs audit history
✔ Sends email notification asynchronously

🕵️ Audit Trail (ApplicationHistory)
Every stage change is stored with:

Job application ID

Previous stage

New stage

Changed by (user ID)

Timestamp

This ensures a complete and accurate audit history.

✉️ Email Notifications
Triggered when application stage changes

Implemented using Nodemailer

Sent asynchronously so API remains responsive

⚙️ Environment Variables
Create a .env file in the project root:

env
Copy code
PORT=3000
MONGO_URI=mongodb://localhost:27017/jobTracker
EMAIL_USER=Susmithanandigramam.0215@gmail.com
EMAIL_PASS=######
JWT_SECRET=your_jwt_secret
▶️ Running the Project
cmd
Copy code
npm install
node src/app.js
Server will run at:

arduino
Copy code
http://localhost:3000
🧪 Testing
Use Postman or curl

Candidate token for CRUD operations

Recruiter token for stage transitions

🏗️ Project Structure
bash
Copy code
job-application-tracker/
│
├── src/
│   ├── app.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── .env
├── package.json
└── README.md
🔮 Future Enhancements
Background job queue (Bull / RabbitMQ) for emails

Admin dashboard

Pagination and filtering

✅ Expected Outcomes Status
✔ Fully functional REST API
✔ Workflow state machine
✔ Audit trail for stage changes
✔ Role-based access control
✔ Responsive API
✔ Comprehensive documentation

👨‍💻 Author
24A95A0501
Lakshmi Susmitha
CSE – 3rd Year