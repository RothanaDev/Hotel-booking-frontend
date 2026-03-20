## RN Hotel Booking Frontend

This project is a modern hotel booking web application built with Next.js 16, TypeScript, and Tailwind CSS. It provides a seamless experience for users to browse rooms, manage bookings, and handle payments securely. The frontend is designed for performance, accessibility, and scalability, following best practices from the Next.js ecosystem.

### Features

- **User Authentication:** Secure registration, login, and email verification flows.
- **Room Browsing:** Search, filter, and view detailed information about available rooms.
- **Booking Management:** Add rooms and services to a cart, review booking history, and manage reservations.
- **Service Add-ons:** Select extra services to enhance the stay experience.
- **Checkout & Payments:** Streamlined checkout process with PayPal integration for secure payments.
- **Responsive UI:** Fully responsive and accessible design for all devices.

### Tech Stack

- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios

### Getting Started

1. Install dependencies:
	```bash
	npm install
	```
2. Start the development server:
	```bash
	npm run dev
	```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Project Structure

- `app/` — Main application pages and routing
- `components/` — Reusable UI and feature components
- `lib/` — API utilities, authentication, and helpers
- `types/` — TypeScript type definitions
- `public/` — Static assets and images

### Deployment

Deploy easily to Vercel or your preferred platform. For production, ensure environment variables are set in `.env.local` (see example in the repo). For more details, refer to the Next.js [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

For questions, feedback, or contributions, please open an issue or pull request.
