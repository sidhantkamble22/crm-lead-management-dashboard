# CRM Lead Management Dashboard

A responsive CRM Lead Management Dashboard built with Next.js and Tailwind CSS for managing, tracking, and analyzing sales leads.

## Live Demo

Add your deployed project URL here.

## GitHub Repository

https://github.com/sidhantkamble22/crm-lead-management-dashboard

---

## Features

### Dashboard
- Total Leads
- New Leads
- Contacted Leads
- Qualified Leads
- Converted Leads
- Lost Leads
- Conversion Percentage
- Leads by Status Analytics
- Leads by Source Analytics

### Lead Management
- View all leads
- Search by name, email, or company
- Filter by status
- Filter by source
- Sort by created date
- Pagination
- Responsive mobile card layout

### Add & Edit Leads
- Add new leads
- Edit existing leads
- Form validation
- Required field validation
- Email validation
- Indian phone number validation
- Duplicate email prevention
- Success and error feedback

### Lead Details
- Complete lead information
- Current lead status
- Update lead status
- Activity timeline
- Created date
- Edit lead
- Delete lead
- Delete confirmation modal

### UX & Performance
- Responsive design
- Loading states
- Empty states
- Error states
- Debounced search
- Reusable React components
- Mobile-friendly navigation
- Optimized API requests

---

## Tech Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- React Icons

### Backend
- Next.js API Routes
- REST API

### Tools
- Git
- GitHub
- ESLint
- npm

---

## Project Structure

```text
crm-lead-management-dashboard/
│
├── app/
│   ├── api/
│   │   └── leads/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
│   │
│   ├── leads/
│   │   └── [id]/
│   │       └── page.js
│   │
│   ├── page.js
│   ├── layout.js
│   └── globals.css
│
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.js
│   │   ├── Header.js
│   │   ├── StatCard.js
│   │   ├── StatsGrid.js
│   │   ├── LeadToolbar.js
│   │   ├── StatusBadge.js
│   │   ├── LeadRow.js
│   │   ├── LeadTable.js
│   │   ├── Pagination.js
│   │   ├── AddLeadModal.js
│   │   ├── Analytics.js
│   │   └── Toast.js
│   │
│   └── leads/
│       ├── LeadDetails.js
│       ├── LeadForm.js
│       ├── ActivityTimeline.js
│       └── DeleteLeadModal.js
│
├── lib/
│   └── leads.js
│
├── public/
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md

REST API
Get All Leads
GET /api/leads

Returns all leads.

Get Lead by ID
GET /api/leads/:id

Returns details of a specific lead.

Create Lead
POST /api/leads

Example request:

{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "+91 9876543210",
  "company": "Tech Solutions",
  "status": "New",
  "source": "Website"
}
Update Lead
PUT /api/leads/:id

Example request:

{
  "status": "Contacted"
}
Delete Lead
DELETE /api/leads/:id

Deletes a lead by ID.

Lead Statuses

The application supports:

New
Contacted
Qualified
Converted
Lost
Lead Sources

The application supports:

Website
LinkedIn
Referral
Google
Other
Getting Started
1. Clone the repository
git clone https://github.com/sidhantkamble22/crm-lead-management-dashboard.git
2. Navigate to the project
cd crm-lead-management-dashboard
3. Install dependencies
npm install
4. Start the development server
npm run dev
5. Open the application
http://localhost:3000
Production Build

Create a production build:

npm run build

Start the production server:

npm start
Validation

The application validates:

Required name
Required company
Valid email format
Valid Indian phone number
Valid lead status
Valid lead source
Duplicate email prevention
Data Storage

This project uses an in-memory mock data store located at:

lib/leads.js

The REST API is implemented using Next.js API Routes.

Limitation

Since the current implementation uses in-memory data, newly created, updated, or deleted leads will reset when the server restarts.

For a production application, the mock data store can be replaced with a persistent database such as MongoDB or PostgreSQL.

Design Approach

The dashboard follows a clean SaaS/CRM design approach with:

Sidebar navigation
Dashboard statistics
Lead management table
Responsive mobile layout
Lead detail page
Modal-based lead creation
Reusable lead form
Status badges
Activity timeline
Analytics section
Toast notifications
Responsive navigation drawer

The UI is designed to work across desktop, tablet, and mobile devices.

Assignment Requirements Covered
Responsive CRM dashboard
Lead statistics
Search functionality
Status filtering
Source filtering
Date sorting
Pagination
Add lead
Edit lead
Delete lead
Lead details
Status updates
Activity timeline
REST API integration
Form validation
Loading states
Empty states
Error states
Debounced search
Reusable React components
Responsive UI
Future Improvements

Possible production-level improvements:

MongoDB/PostgreSQL database
Authentication and authorization
Role-based access control
Server-side pagination
Advanced analytics
Lead assignment to sales representatives
Email integration
WhatsApp integration
Export leads to CSV
Real-time notifications
Author

Sidhant Kamble

Frontend Developer | React | Next.js | JavaScript





