# RetailCore POS

RetailCore POS is a web-based, multi-branch retail point-of-sale (POS) system designed for fast checkout, accurate inventory control, and operational reporting.  
The system supports barcode scanning via device cameras (webcam/mobile) and is built with a privacy-first approach by not collecting customer personal data.

RetailCore POS is designed as a long-term, full-stack SaaS-style system that mirrors real-world retail operations.

---

## 🚀 Key Features

- Multi-branch retail support
- Product setup with barcodes, SKUs, and pricing
- Webcam / device camera barcode scanning
- Inventory tracking per branch
- Stock transfers and adjustments
- Fast sales & checkout workflow
- Multiple payment methods (cash, mobile money, card)
- Receipt generation (print / digital)
- Role-based access control
- Audit logs and business reports

---

## 🧩 System Modules

### 1. Business & Branch Management
- Business onboarding
- Branch (store) creation
- Branch-specific configuration and reporting

### 2. User & Role Management
- User authentication
- Role-based authorization
- Roles: Owner, Manager, Cashier
- Activity tracking for accountability

### 3. Product Setup & Registration
- Product creation and editing
- Category assignment
- Barcode and SKU configuration
- Pricing and tax setup
- Product activation and deactivation

> Products must be registered in the system before they can be scanned and sold at checkout.

### 4. Inventory Management
- Stock tracking per branch
- Opening stock setup
- Stock adjustments (damage, loss)
- Stock transfers between branches
- Low-stock alerts

### 5. Sales & Checkout Engine
- Barcode scanning via device camera
- Manual barcode entry fallback
- Cart management
- Discounts and tax calculation
- Inventory updates on checkout
- Refund and reversal handling

### 6. Payments & Cash Management
- Support for multiple payment methods
- Split payments
- Cash drawer open/close sessions
- Refund processing

### 7. Reporting & Analytics
- Daily and monthly sales reports
- Best-selling products
- Inventory valuation
- Low-stock reports
- Staff performance reports

### 8. Audit Logs & System Integrity
- Inventory change logs
- Price change history
- Sales and refund logs
- User activity logs

---

## 👥 User Roles

- **Owner**
  - Full system access
  - Business and branch management
  - Reporting and configuration

- **Manager**
  - Product and inventory management
  - Sales and reporting access

- **Cashier**
  - Checkout and sales processing only

---

## 🛠️ Planned Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
- **API Style:** REST
- **Deployment:** To be determined

---

## 🔄 Core Workflow Overview

### Product Onboarding
1. Manager creates a product
2. Assigns barcode, SKU, and price
3. Sets tax rules and activates product
4. Adds opening stock per branch

### Checkout
1. Cashier scans product barcode using device camera
2. System retrieves product and validates stock
3. Product is added to cart
4. Discounts and taxes are applied
5. Payment is recorded
6. Inventory is updated
7. Receipt is generated

---


