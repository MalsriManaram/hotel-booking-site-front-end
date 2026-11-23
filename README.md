## 🏨 StayLux — AI-Driven Luxury Hotel Booking System (MERN + Vite + Google Gemini)

An end-to-end AI-powered hospitality discovery and reservation platform built with **MongoDB, Express + TypeScript, Google Gemini API Free Tier (`@google/genai`), React 18, Redux Toolkit (RTK Query), Tailwind CSS, shadcn/ui, and Vite**.

## ✨ Key Features

- **Google Gemini Free Tier Vector Search (`gemini-embedding-001`)**: Embeds hotel profiles into 768-dimensional L2-normalized semantic vectors stored directly in MongoDB (`hotelGeminiVectors`) and blends neural cosine similarity with structured NLP filter extraction (`under $250`, `4.5+ stars`, location, amenities, and check-in/check-out availability).
- **Stateful Gemini 3.8 Flash Travel Concierge**: Multi-turn AI advisor using the Gemini Interactions API (`previous_interaction_id`) grounded on live StayLux hotel data for property comparisons, custom itineraries, and promo guidance.
- **Gemini AI Review Highlights & Verified Stays**: Summarizes guest feedback with `gemini-3.8-flash` alongside star distribution bars and verified-stay badges.
- **Instant WhatsApp Store Checkout & Vouchers**: Generates `SLX-...` booking references, formatted WhatsApp Store confirmation links, printable booking vouchers, and automated HTML confirmation emails. Optional PayHere Sri Lanka Sandbox support via `VITE_PAYHERE_MERCHANT_ID`.
- **Multi-Room Inventory, Promo Codes, Wishlists & Multi-Currency**: Dynamic room tiers (`Single`, `Double`, `Deluxe`, `Suite`), promo codes (`STAYLUX10`, `WELCOME15`, `LUXURY20`), live currency switcher (`USD`, `LKR`, `EUR`, `AUD`, `JPY`), Wishlist heart toggles, and `/admin` Control Center.

## ⚙️ Environment Setup

- **Backend (`.env`)**: Add `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey) (Free Tier).
- **Frontend (`.env`)**: Set `VITE_BACKEND_URL` and `VITE_CLERK_PUBLISHABLE_KEY`.

## 🚀 Repositories

- **Frontend**: https://github.com/MalsriManaram/hotel-booking-site-front-end
- **Backend**: https://github.com/MalsriManaram/hotel-booking-site-back-end
