# MobileHub 📱 | Full-Stack Indian Mobile-Commerce Platform

[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 23](https://img.shields.io/badge/Java-23-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

A **complete, production-ready full-stack e-commerce application for a mobile phone shop**, architected to mirror top Indian retail tech platforms like Croma, Reliance Digital, Vijay Sales, and official flagship brand stores.

---

## 🌟 Key Highlights & Features

### 🛒 Customer Storefront (26 Pages)
- **Indian M-Commerce Experience**: Native Indian Rupee formatting (`₹`), 18% GST invoice generation, Indian pincode delivery estimator, and No-Cost EMI calculations.
- **Dynamic Catalog & Filtering**: Multi-facet filtering by Brand (Apple, Samsung, OnePlus, Xiaomi, Realme, Vivo, Google, Nothing, Motorola), Categories (Flagship, 5G, Foldables, Budget, Audio, Chargers), Price range, RAM, Storage, and Rating.
- **Rich Product Detail Pages**: High-resolution image galleries, technical specs matrix (Processor, Display, Camera, Battery, OS, 5G), stock levels, and customer reviews with verified purchase tags.
- **Shopping Cart & Coupon Engine**: Interactive quantity management, free delivery progress bar (Free delivery over ₹999), instant promo code validator (`WELCOME500`, `FESTIVE10`), and real-time discount deduction.
- **3-Step Checkout Flow**: 
  1. Delivery Address (Select saved address or inline new address creation with pin code and phone validation)
  2. Order Review & Delivery speed
  3. Payment Method Choice (UPI QR, Credit/Debit Card, Net Banking, COD)
- **Simulated Payment Gateway**: Real-time 10-minute session countdown, UPI QR code scanner simulator with copyable VPA, Card 3D-Secure simulation, and major Indian banks net-banking selector.
- **Shipment & Courier Tracking**: Airway Bill (AWB) tracker with interactive `OrderTimeline` stepper (`Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`).
- **Customer Self-Service**: Order history, order cancellation with reason tracking, wishlist management ("Move to Cart" action), profile management, and multiple delivery addresses.

### 🛡️ Dedicated Admin Management Portal
- **Analytics Dashboard**: Real-time Gross Merchandise Value (GMV), total order velocity, registered customer metrics, 7-day sales Recharts area chart, and fulfillment pipeline bar chart.
- **Catalog Management**: Full CRUD on smartphone models with complete hardware specifications (RAM, Storage, Camera, Battery, Display, 5G flags, hero image URLs).
- **Warehouse & Inventory Control**: Live stock auditor, low-stock threshold triggers, out-of-stock badges, and 1-click inline restock stepper.
- **Order Fulfillment Center**: Transition orders between statuses (`PLACED` → `CONFIRMED` → `PACKED` → `SHIPPED` → `DELIVERED`), assign courier tracking numbers (AWB), and view line items.
- **Review Moderation**: Approve, reject, or purge customer reviews.
- **Coupons & Promotional Engine**: Configure percentage or fixed discounts, minimum cart thresholds, maximum discount caps, usage limits, and expiration dates.
- **Banners & Marketing**: Control homepage hero carousel banners and campaign destination links.
- **Financial & Tax Reporting**: Export GMV and 18% GST liability breakdowns to CSV for tax filing.

---

## 🔑 Demo Credentials (1-Click Login Supported)

The login page contains **1-Click Demo Login** buttons that automatically log you in without typing:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mobilehub.com` | `Admin@123` | Full Admin Dashboard & Storefront |
| **Customer** | `customer@mobilehub.com` | `Customer@123` | Storefront, Cart, Checkout, Orders |

---

## 🏗️ Architecture & Technology Stack

```
mobilehub/
├── backend/                  # Java 23 / Spring Boot 3.3.4 REST API
│   ├── src/main/java/com/mobilehub/
│   │   ├── config/           # Security, Swagger OpenAPI, DataInitializer
│   │   ├── controller/       # 14 REST Controllers (Auth, Product, Cart, Order, Admin...)
│   │   ├── dto/              # Request / Response DTOs
│   │   ├── entity/           # JPA Entities (Product, Order, Inventory, Coupon...)
│   │   ├── exception/        # GlobalExceptionHandler & Custom Exceptions
│   │   ├── repository/       # 14 Spring Data JPA Repositories
│   │   ├── security/         # JWT Provider, AuthFilter, UserPrincipal
│   │   └── service/          # Business logic services & implementations
│   ├── src/main/resources/   # application.properties (Profiles: dev H2, mysql)
│   ├── src/test/java/        # JUnit 5 & Mockito Unit Tests (100% Passing)
│   ├── Dockerfile            # Multi-stage Maven / Temurin JRE build
│   └── pom.xml
├── frontend/                 # React 18, Vite, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── api/              # Axios client & typed endpoint services
│   │   ├── components/       # Reusable UI (Navbar, Footer, ProductCard, Timeline, Rating...)
│   │   ├── context/          # Auth, Cart, Wishlist, Toast state providers
│   │   ├── layouts/          # CustomerLayout & AdminLayout (dark theme)
│   │   ├── pages/            # 26 Customer storefront views
│   │   ├── pages/admin/      # 12 Admin portal management views
│   │   ├── types/            # TypeScript interfaces matching backend models
│   │   └── utils/            # Formatters (INR Currency, EMI, Dates)
│   ├── Dockerfile            # Multi-stage Node / Nginx production build
│   └── nginx.conf            # Reverse proxy configuration
├── database/
│   ├── schema.sql            # Full MySQL 8.0 DDL script (20 tables)
│   └── seed.sql              # Realistic seed data (40 phones, brands, coupons, reviews)
├── docker-compose.yml        # 3-tier container orchestration (MySQL + Spring + Nginx)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 or 23** installed.
- **Node.js 18+** & npm.
- **Maven 3.9+** (or use included wrapper).
- *(Optional)* **Docker & Docker Compose** for container deployment.

---

### Option 1: Run Locally (Fastest - Zero Config H2 Database)

#### 1. Start the Spring Boot Backend
```powershell
cd mobilehub/backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Backend starts at: `http://localhost:8080`
- Swagger OpenAPI documentation: `http://localhost:8080/swagger-ui.html`
- H2 Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:mobilehubdb`, User: `sa`, Password: empty)
- *Note: On startup, `DataInitializer` automatically seeds 40 smartphones, 10 brands, 8 categories, active coupons, sample orders, and reviews.*

#### 2. Start the React Frontend
```powershell
cd mobilehub/frontend
npm install
npm run dev
```
- Frontend starts at: `http://localhost:5173`
- Open your browser to `http://localhost:5173` and click **"1-Click Customer Demo"** or **"1-Click Admin Demo"** to begin exploring!

---

### Option 2: Run with Docker Compose (Full Stack with MySQL 8)

From the project root:
```bash
docker-compose up --build -d
```
This orchestrates:
1. **`mysql-db`**: MySQL 8 container with schema and seed data loaded on port `3306`.
2. **`backend`**: Spring Boot container running on port `8080`.
3. **`frontend`**: Nginx container serving optimized production React build on port `80`.

Open:
- Storefront: `http://localhost`
- Admin Dashboard: `http://localhost/admin`
- Swagger API Docs: `http://localhost:8080/swagger-ui.html`

---

## 🧪 Testing & Quality Assurance

### Run Backend Unit Tests
```powershell
cd mobilehub/backend
mvn clean test
```
Result: **BUILD SUCCESS** (All unit tests for product catalog, coupon calculations, stock verification pass with 0 failures).

### Run Frontend Production Build
```powershell
cd mobilehub/frontend
npm run build
```
Result: TypeScript compiles cleanly with 0 errors, outputting production bundle in `dist/`.

---

## 📜 License
Developed as a production reference architecture for modern Indian mobile-commerce stores. Licensed under the MIT License.
