# Bunone Bondhon

This repository is being migrated from Flask/MySQL to Next.js, Tailwind CSS, and Supabase Postgres.

## Brand direction

- Warm cream, gold, maroon, brown, terracotta, and ivory
- Headings: Playfair Display
- Body: Poppins
- Bengali support: Hind Siliguri

## What is already scaffolded

- Next.js app router structure
- Tailwind theme aligned to the brand palette
- Supabase client helpers
- Supabase Postgres schema and seed data
- Page skeletons for login, register, shop, cart, order history, and admin

## What I still need from you to finish the live data wiring

- Your Supabase project URL
- Your Supabase anon key
- Your Supabase service role key
- Confirmation that you want Supabase Auth for login/register
- Whether admin users should be created manually in Supabase or via an invite flow

## Run locally

1. Copy `.env.example` to `.env.local` and fill in the Supabase values.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

## Database setup

1. Open the Supabase SQL editor.
2. Run `supabase/schema.sql`.
3. Add any initial admin user and update their `profiles.role` to `admin`.