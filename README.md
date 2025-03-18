# **TLE Contest - Local Setup Guide**

## **Getting Started**

Follow the steps below to set up and run the TLE Contest application locally.

---

## **1. Clone the Repository**

Run the following command to clone the project:

```sh
git clone https://github.com/<Your_Github>/TLE-Contest.git
```

---

## **2. Configure `config.ts` File**

- Navigate to `frontend/config.ts`
- Comment out `BACKEND_URL` for production
- Uncomment `BACKEND_URL` for local development

---

## **3. Frontend Setup**

```sh
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## **4. Configure Environment Variables**

Create a `.env` file inside the `backend` directory and add the following:

```sh
DATABASE_URL="YOUR_POSTGRESQL_URL"
```

---

## **5. Backend Setup**

```sh
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the development server
npm start
```

---

## **6. Application is Ready!**

Your **TLE Contest** application is now up and running locally! 🚀
