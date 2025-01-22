# Khedut.com

Khedut.com is a platform aimed at empowering farmers by providing them with essential resources, tools, and a seamless connection to agricultural products and services. The website connects the farming community with valuable information, weather updates, product listings, and more, helping farmers optimize their agricultural practices.

## Features

- **User Authentication**: Secure and easy login/sign-up system using JWT.
- **Farmer Resources**: Access farming guides, tutorials, and essential resources.
- **Product Listings**: Users can list and browse agricultural products for sale.
- **Third-Party API Integrations**: Real-time weather updates and product information via external APIs.
- **Admin Dashboard**: Manage users, products, and content.
- **Responsive Design**: Optimized experience across devices (mobile, tablet, desktop).

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **API Integration**: Third-party weather and product APIs

## Project Structure

```
khedut.com/
├── client/               # Frontend (React + Next.js)
├── server/               # Backend (Node.js + Express)
```

## Installation

To run the project locally, follow the steps below:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/khedut.com.git
   ```

2. **Navigate to the backend directory**:
   ```bash
   cd khedut.com/server
   ```

3. **Install backend dependencies**:
   ```bash
   npm install
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

5. **Navigate to the frontend directory**:
   ```bash
   cd ../client
   ```

6. **Install frontend dependencies**:
   ```bash
   npm install
   ```

7. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

The application should now be running locally. Visit `http://localhost:3000` to access the frontend and interact with the platform.

