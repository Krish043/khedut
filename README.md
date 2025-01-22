# Khedut.com

Khedut.com is a platform designed to connect farmers directly with buyers, eliminating middlemen and ensuring fair and justifiable profits for farmers. By providing a seamless experience for listing, purchasing, and managing products, farmers can maximize their earnings while buyers gain access to fresh, quality agricultural products at competitive prices.

## Features

- **User Authentication**: Secure login and sign-up system using JWT.
- **Apply for Schemes**: Farmers can apply for agricultural schemes to receive financial support and benefits.
- **Farmer Resources**: Access farming guides, tutorials, and other resources for better agricultural practices.
- **Product Listings**: Farmers can list their products (vegetables, fruits, etc.) category-wise for sale. Buyers can browse and purchase products based on categories.
- **Profit Tracking**: The profit from sales is tracked category-wise and added to the farmer’s account. A visual profit bar chart is available on the farmer’s dashboard to monitor earnings.
- **Stripe Payment Gateway**: Integrated payment system for seamless, secure transactions between buyers and farmers.
- **Blogging Platform**: Authenticated users can create, edit, and share blogs. Blogs can be liked, commented on, and shared within the community.
- **Farmer Dashboard**: Farmers can view their posted blogs, applied schemes, the most liked blog, and a visual representation of their financial performance.
- **Admin Dashboard**: For managing users, products, blog content, and schemes.
- **Responsive Design**: The platform is optimized for an excellent user experience across desktop, tablet, and mobile devices.

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Stripe for secure payments
- **APIs**: Integration with third-party weather and product APIs

## Project Structure

```
khedut.com/
├── client/               # Frontend (React + Next.js)
├── server/               # Backend (Node.js + Express)
```

## Installation

To run the project locally, follow these steps:

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

4. **Set up environment variables**:
   - Make sure to configure your `.env` file with necessary keys, such as Stripe keys and MongoDB URI.

5. **Start the backend server**:
   ```bash
   npm start
   ```

6. **Navigate to the frontend directory**:
   ```bash
   cd ../client
   ```

7. **Install frontend dependencies**:
   ```bash
   npm install
   ```

8. **Start the frontend development server**:
   ```bash
   npm run dev
   ```

Your local setup will now be ready. Visit `http://localhost:3000` to see the platform in action.
