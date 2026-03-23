# FindMyEvent - Event Management Platform

A comprehensive event management platform built with Node.js that allows users to create, manage, and book tickets for events. This RESTful API provides complete event lifecycle management from creation to attendance tracking.

### User Management
- User registration with email validation
- Secure login with JWT authentication
- User profile management (view, update, delete)
- View all users (admin functionality) // admin access implementation need to be implemented

### Event Management
- Create and manage events
- Ticket booking system with capacity management
- Real-time ticket availability tracking
- View all events or filter by upcoming events
- Attendance tracking system
- User ticket history
- Update and delete events

### Security
- JWT-based authentication
- Input validation with Joi
- Secure password handling
- Protected routes with middleware

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Database:** MySQL
- **API Documentation:** OpenAPI 3.0 (Swagger)

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pmayur02/FindMyEvent/
cd find-my-event
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your configuration (see [Environment Variables](#environment-variables))
```

5. **Start the server**
```bash
# Development mode
npm run dev
```

The server will start on `http://localhost:8000`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000


# Database Configuration
DB_HOST=localhost
DB_NAME=eventmanagement
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
SECRET_KEY=your_super_secret_jwt_key_here


## API Documentation

Base URL: `http://localhost:8000`

### Authentication Endpoints

#### Register User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

#### Get User Profile
```http
GET /users/user-profile
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update User Profile
```http
PATCH /users/update-user/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

#### Delete User Account
```http
DELETE /users/remove-user/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Event Management Endpoints

#### Create Event
```http
POST /events/create-event
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Dance Show",
  "description": "This is a dance show",
  "event_date": "2026-03-20",
  "event_time": "15:00",
  "total_capacity": 100
}
```

#### Get All Events
```http
GET /events/fetch-events
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Event by ID
```http
GET /events/fetch-event/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Event
```http
PATCH /events/update-event/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Dance Show Updated",
  "description": "This is an updated dance show",
  "total_capacity": 150
}
```

#### Delete Event
```http
DELETE /events/remove-event/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Book Ticket
```http
POST /events/book-ticket
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "eventId": 1,
  "noOfTicket": 2
}
```

**Response:**
```json
{
  "message": "Ticket booked successfully",
  "data": {
    "ticket_id": "6ATQppWaVgfkFQtXm9mR",
    "event_id": 1
  }
}
```

#### Get My Tickets
```http
GET /events/mytickets
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Mark Attendance
```http
GET /events/mark-attendance/:ticketId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Upcoming Events (Public)
```http
GET /events/upcoming-events
```

## Database Schema

### Users Table
```sql
create table Users(
id int primary key auto_increment,
name varchar(50) not null,
email varchar(50) unique not null,
password varchar(255) not null,
created_at datetime default now()
);
```

### Events Table
```sql
create table Events(
id int primary key auto_increment,
title varchar(50) not null,
description varchar(150),
event_date date not null,
event_time time not null,
total_capacity int not null default 200,
remaining_tickets int not null,
created_by int not null,
created_at datetime default now(),
foreign key (created_by) references Users (id) on delete cascade
);
```

### Tickets Bookings
```sql
create table Bookings(
id int primary key auto_increment,
ticket_id varchar(20) unique not null,
user_id int not null,
event_id int not null,
no_of_tickets int  not null
booking_date datetime not null,
foreign key (user_id) references Users (id) on delete cascade, 
foreign key (event_id) references Events (id) on delete cascade
);

```

### Event Attendance
```sql
create table Event_Attendance(
id int primary key auto_increment,
user_id int not null,
event_id int not null,
ticket_id varchar(20) unique not null,
entry_time datetime not null,
foreign key (user_id) references Users (id) on delete cascade,
foreign key (event_id) references Events (id) on delete cascade,
foreign key (ticket_id) references Bookings (ticket_id) on delete cascade
);

```

## Validation

This project uses Joi for request validation. All endpoints validate:

- **Email format** - Must be a valid email
- **Password strength** - Minimum 6 characters
- **Date validation** - Event dates must be in the future
- **Capacity limits** - Maximum 100,000 capacity per event
- **Ticket limits** - Maximum 50 tickets per booking

Example validation error response:
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

## Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### How to use:

1. **Register** or **Login** to get a token
2. Include the token in the **Authorization header** for protected routes:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

### Error Response Format

```json
{
  "message": "Error description here"
}
```
## API Documentation (Swagger)

Once the server is running, access the interactive API documentation at:

```
http://localhost:8000/api/docs/
```
