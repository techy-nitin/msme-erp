# MSME ERP

A full-stack Enterprise Resource Planning (ERP) application built to help small and medium-sized businesses manage their business operations, financial records, invoices, payments, and reports from one place.

## Features

### Business Operations

- **Dashboard:** View business summaries, revenue information, and pending payments.
- **Client Management:** Maintain customer records and access client information.
- **Vendor Management:** Organize vendor details and related business records.
- **Product Management:** Manage product information and categories.
- **Employee Management:** Maintain employee records.
- **Company Settings:** Manage company-related information.

### Financial Management

- **Invoice Management:** Create and manage invoices and invoice items.
- **Quotation Management:** Organize quotations and their associated items.
- **Payment Tracking:** Manage payment records and monitor outstanding payments.
- **Expense Management:** Maintain business expense records.
- **Accounts and Reports:** Access financial summaries and reporting features.

### Documents and Notifications

- **Document Management:** Handle business documents.
- **PDF Generation:** Generate PDF documents for supported business workflows.
- **Data Export:** Export supported reports in PDF, CSV, and Excel formats.
- **Email Notifications:** Support email-based business notifications.
- **WhatsApp Notifications:** Includes services for invoice and quotation messaging.
- **Authentication:** Login, password-change functionality, and JWT-based authentication components.

### User Interface

- **React-Based Frontend:** Built with reusable React components.
- **Dashboard Interface:** Organized layout with navigation and data cards.
- **Interactive Components:** Tables, forms, pagination, dropdowns, and modal dialogs.
- **Data Visualization:** Charts for financial summaries.
- **Dedicated Modules:** Separate pages for invoices, payments, products, clients, vendors, expenses, quotations, employees, accounts, and reports.

## Technology Stack

### Frontend
- React.js
- JavaScript
- Vite
- CSS
- npm

### Backend
- Java
- Spring Boot
- Maven
- REST APIs
- JWT-based authentication

## Project Structure

```text
msme-erp/
├── backend/
│   ├── src/
│   ├── .mvn/
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Java Development Kit (JDK), compatible with the backend configuration
- Node.js and npm
- Git
- A database configured for the backend

### 1. Clone the Repository

```bash
git clone https://github.com/techy-nitin/msme-erp.git
cd msme-erp
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure the required database connection and application settings in the Spring Boot configuration file. Use the provided example configuration as a reference, where applicable.

Keep database passwords, API keys, JWT secrets, and other sensitive information out of version control.

### 3. Start the Backend

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

### 4. Install Frontend Dependencies

Open a new terminal from the project root and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 5. Start the Frontend

```bash
npm run dev
```

Open the local development URL displayed in the terminal by Vite.

Ensure the frontend API configuration points to the correct backend address.

## Running Backend Tests

From the `backend` directory, run:

**Windows**
```powershell
.\mvnw.cmd test
```

**Linux/macOS**
```bash
./mvnw test
```

## Author

**Nitin Sharma**

- GitHub: [@techy-nitin](https://github.com/techy-nitin)
- Repository: [MSME ERP](https://github.com/techy-nitin/msme-erp)
