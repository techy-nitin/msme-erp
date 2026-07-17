# MSME ERP System

A full-stack ERP and Billing Management System developed for Micro, Small and Medium Enterprises (MSMEs). The application helps businesses manage clients, vendors, products, invoices, quotations, expenses, payments, employees, reports, and company settings from a single dashboard.

---

## Features

### Dashboard
- Business overview
- Revenue & expense analytics
- Account summary
- Recent activities

### Client Management
- Add, edit and delete clients
- GST Number support
- Contact & address management

### Vendor Management
- Vendor registration
- Payment terms
- Vendor details management

### Product Management
- Product catalog
- Categories
- GST rates
- Pricing

### Invoice Management
- Create invoices
- Generate PDF invoices
- Email invoices
- Payment tracking

### Quotation Management
- Create quotations
- Generate PDF quotations
- Convert quotation to invoice

### Expense Management
- Record expenses
- Category-wise tracking

### Payment Management
- Record customer payments
- Payment history

### Accounts
- Revenue
- Expenses
- Profit
- GST summary

### Reports
- Sales Report
- Expense Report
- GST Report
- Client Report
- Vendor Report
- Outstanding Report
- Profit & Loss Report
- Employee Salary Report

### Company Settings
- Company profile
- GST details
- Bank details
- Logo upload

### Authentication
- Secure login
- Change password
- Profile management

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- Lucide React

## Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Apache PDFBox
- JavaMail

## Database
- PostgreSQL (Supabase)

---

# Project Structure

```
msme-erp/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

---

# Installation

## Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8081
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Configuration

Before running the project, create:

```
backend/src/main/resources/application.properties
```

Configure:

- PostgreSQL Database
- Email SMTP
- JWT Secret (if applicable)

Do not commit sensitive credentials to GitHub.

---

# Future Enhancements

- GST Verification API
- Inventory Management
- Purchase Orders
- Payroll
- E-Invoice Integration
- E-Way Bill
- Multi-user Roles
- Cloud Deployment

---

# Screenshots

Add screenshots of:

- Login
- Dashboard
- Clients
- Vendors
- Products
- Invoices
- Quotations
- Reports
- Accounts
- PDF Invoice

---

# Author

**Nitin Sharma**

Full Stack Java Developer

---

# License

This project is developed for educational and portfolio purposes.