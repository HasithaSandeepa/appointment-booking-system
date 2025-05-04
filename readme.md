# Appointment Booking System

This is a full-stack web application for managing appointments. It allows users to book appointments, view their booked appointments, and cancel appointments. Admins can manage available slots and view all appointments.

<img width="1680" alt="Appointment Booking System" src="https://github.com/user-attachments/assets/6e0c1bd8-09ea-4db6-894d-6e35a9c30ed7" />

---

## **Features**

### **User Features**

1. **View Available Slots**: Users can view available time slots for appointments.
2. **Book an Appointment**: Users can book an appointment by selecting a date, time, and providing their details (name, contact).
3. **View Booked Appointments**: Users can view their booked appointments.
4. **Cancel an Appointment**: Users can cancel their booked appointments.

### **Admin Features**

1. **Add New Slots**: Admins can add new available slots for appointments.
2. **View All Appointments**: Admins can view all booked appointments.
3. **Delete Appointments**: Admins can delete any appointment.

### **Additional Features**

- **Calendar View**: Admins can view booked appointments in a calendar with highlighted dates.
- **Profile Management**: Users can update their profile details and upload a profile picture.

---

## **Tools and Technologies Used**

### **Frontend**

- **React.js**: A JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework for styling components.
- **Axios**: A promise-based HTTP client for making API requests.
- **React-Calendar**: A lightweight calendar component for React.

### **Backend**

- **Node.js**: A JavaScript runtime for building the backend server.
- **Express.js**: A web framework for Node.js.
- **MySQL**: A relational database for storing user and appointment data.
- **JWT (JSON Web Tokens)**: For user authentication and authorization.
- **Multer**: For handling file uploads (e.g., profile pictures).

### **Other Tools**

- **Postman**: For testing API endpoints.

---

## **Steps to Set Up and Run the Project Locally**

### **Prerequisites**

1. **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
2. **MySQL**: Install MySQL from [mysql.com](https://www.mysql.com/).
3. **Git**: Install Git from [git-scm.com](https://git-scm.com/).

### **Step 1: Clone the Repository**

Clone the project repository to your local machine:

```bash
git clone https://github.com/HasithaSandeepa/appointment-booking-system.git
cd appointment-booking-system
```

### **Step 2: Set Up the Backend**

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    pnpm install
    ```
3.  Create a `.env` file in the `backend` folder and add the following environment variables:

    ```env
    DB_HOST=localhost
    DB_USER=your-mysql-username
    DB_PASSWORD=your-mysql-password
    DB_NAME=appointment_system
    DB_PORT=your-port
    ```

    Example

    ```env
    DB_HOST=127.0.0.1
    DB_USER=root
    DB_PASSWORD=root
    DB_NAME=appointment_system
    DB_PORT=8889
    ```

4.  Set up the MySQL database:

    - Open MySQL and create a database:
      ```sql
      CREATE DATABASE appointment_system;
      ```
    - Run the following SQL commands to create the required tables:

           ```sql
           USE appointment_system;

           CREATE TABLE users (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             contact VARCHAR(255) NOT NULL,
             email VARCHAR(255) UNIQUE NOT NULL,
             password VARCHAR(255) NOT NULL,
             role ENUM('user', 'admin') DEFAULT 'user',
             profile_pic longblob
           );

           CREATE TABLE slots (
             id INT AUTO_INCREMENT PRIMARY KEY,
             date DATE NOT NULL,
             time TIME NOT NULL,
             available BOOLEAN DEFAULT 1
           );

           CREATE TABLE appointments (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             contact VARCHAR(255) NOT NULL,
             slot_id int NULL
             user_id INT,
             FOREIGN KEY (user_id) REFERENCES users(id)
           );

           INSERT INTO `users` (`id`, `name`, `contact`, `email`, `password`, `role`, `profile_pic`) VALUES(1, 'Admin', '0772574672', 'admin@gmail.com', '$2b$10$Axz0iRdRscAq8bGj11l5cucdUOF.FBXyiurMVj0yn7NHb/RUWbVKe', 'admin', '');

           ```

5.  Start the backend server:
    ```bash
    npx nodemon server.js
    ```

### **Step 3: Set Up the Frontend**

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```
3. Start the frontend development server:

   ```bash
   npm run dev
   ```

   or

   ```bash
   pnpm run dev
   ```

### **Step 4: Access the Application**

- Open your browser and go to `http://localhost:5173`.
- Use the following credentials to log in:
  - **Admin**: Email: `admin@gmail.com`, Password: `admin@123`
  - **User**: Register a new account.

---

## **Project Structure**

### **Backend**

- `controllers/`: Contains logic for handling API requests.
- `models/`: Contains database models and queries.
- `routes/`: Defines API routes.
- `middleware/`: Contains middleware for authentication and file uploads.
- `config/`: Contains database configuration.
- `.env`: Stores environment variables.
- `server.js`: Entry point for the backend server.

### **Frontend**

- `src/`: Contains React components and pages.
  - `components/`: Reusable UI components.
  - `context/`: Auth file for authentications.
  - `pages/`: Main pages of the application (e.g., Home, Profile, Admin Panel).
  - `App.js`: Main application component.
  - `App.jsx`: Frontend routes.
  - `Main.jsx`: Main file of the React app.
- `public/`: Contains static assets (e.g., images).

---

## **API Endpoints**

### **User Endpoints**

- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /profile`: Get the logged-in user's profile.
- `PUT /profile`: Update the logged-in user's profile.
- `PUT /profile/picture`: Update the user's profile picture.

### **Appointment Endpoints**

- `GET /slots`: Get all available slots.
- `POST /appointments`: Book a new appointment.
- `GET /appointments`: Get all appointments for the logged-in user.
- `DELETE /appointments/:id`: Cancel an appointment.

### **Admin Endpoints**

- `POST /admin/slots`: Add a new slot.
- `GET /admin/appointments`: Get all appointments (admin only).
- `DELETE /admin/appointments/:id`: Delete an appointment (admin only).

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add new feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request.

## **Contact**

For any questions or feedback, please contact

- **Email**: [hasithasandeepa2000@gmail.com](mailto:your-email@example.com)
- **GitHub**: [HasithaSandeepa](https://github.com/HasithaSandeepa)
- **Linkedin**: [hasitha-sandeepa](https://www.linkedin.com/in/hasitha-sandeepa/)
