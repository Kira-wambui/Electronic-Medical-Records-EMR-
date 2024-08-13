# Electronic Medical Records (EMR) System

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Electronic Medical Records (EMR) System is designed to improve healthcare delivery by digitizing and managing patient records efficiently. The system focuses on appointment scheduling, patient record management, and automated SMS reminders to notify patients about upcoming appointments. It aims to streamline the workflow for healthcare providers and improve patient satisfaction by reducing missed appointments.

## Features

- **Patient Record Management**: Create, read, update, and delete patient records.
- **Appointment Scheduling**: Manage patient appointments with a scheduling system.
- **SMS Reminders**: Send automated SMS reminders to patients for upcoming appointments.
- **Secure Data Storage**: Implement encryption and access controls to protect sensitive patient data.
- **Monitoring**: Implement monitoring tools to ensure system reliability and performance.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MariaDB/MySQL
- **SMS Gateway**: [Twilio](https://www.twilio.com/) or any preferred SMS API
- **ORM**: Sequelize (for database management)
- **Encryption**: bcrypt, JWT for authentication and security
- **Monitoring**: Prometheus, Grafana (optional)

## Architecture

The system follows a modular architecture with the following components:

1. **Database Layer**: Managed using MariaDB/MySQL, structured with a normalized schema.
2. **API Layer**: Built with Express.js to handle CRUD operations for patients and appointments.
3. **Notification Layer**: Integrated with an SMS gateway for sending reminders.
4. **Security Layer**: Implements JWT for authentication and bcrypt for password encryption.
5. **Monitoring Layer**: Uses Prometheus and Grafana for tracking system performance.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MariaDB/MySQL
- Git

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/emr-system.git
    cd emr-system
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the database:
    - Create a database in MariaDB/MySQL:
      ```sql
      CREATE DATABASE emr_system;
      ```
    - Import the database schema:
      ```bash
      mysql -u root -p emr_system < setupDatabase.sql
      ```

4. Set up environment variables (see [Environment Variables](#environment-variables)).

5. Run database migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

## Database Schema

The database schema is designed to manage patient records, appointments, and logs. Here’s a simplified version of the schema:

- **Patients**:
  - `id`: Primary Key
  - `first_name`: VARCHAR(50)
  - `last_name`: VARCHAR(50)
  - `dob`: DATE
  - `gender`: ENUM('Male', 'Female', 'Other')
  - `phone`: VARCHAR(15)
  - `email`: VARCHAR(100)
  - `address`: TEXT

- **Appointments**:
  - `id`: Primary Key
  - `patient_id`: Foreign Key (references `Patients`)
  - `appointment_date`: DATETIME
  - `reason`: TEXT
  - `status`: ENUM('Scheduled', 'Completed', 'Cancelled')

- **Users** (For login management):
  - `id`: Primary Key
  - `username`: VARCHAR(50)
  - `password`: VARCHAR(255)

## API Endpoints

### Patients

- **GET /api/patients**: Retrieve all patients
- **GET /api/patients/:id**: Retrieve a single patient by ID
- **POST /api/patients**: Create a new patient
- **PUT /api/patients/:id**: Update an existing patient
- **DELETE /api/patients/:id**: Delete a patient

### Appointments

- **GET /api/appointments**: Retrieve all appointments
- **GET /api/appointments/:id**: Retrieve a single appointment by ID
- **POST /api/appointments**: Create a new appointment
- **PUT /api/appointments/:id**: Update an existing appointment
- **DELETE /api/appointments/:id**: Delete an appointment

### Authentication

- **POST /api/login**: User login and token generation

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=emr_system

JWT_SECRET=your_jwt_secret

SMS_API_KEY=your_twilio_api_key
SMS_API_SECRET=your_twilio_api_secret
SMS_FROM_NUMBER=your_twilio_phone_number
