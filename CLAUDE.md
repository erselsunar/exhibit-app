# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ExhibitApp** — Fuar Yönetim Sistemi (Exhibition Management System). A full-stack web app for managing trade show clients, venues, expos, booths, and related documents (Bill of Lading, shipping tags).

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL (`backend/`)
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 (`frontend/`)

---

## Running the Project

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Database
PostgreSQL — connection string is in `backend/.env`:
```
DATABASE_URL=postgresql://postgres:1245*@localhost:5432/Exhibit
```
Tables are auto-created on backend startup via `Base.metadata.create_all(bind=engine)`. There are no migration files — schema changes require manual table alterations or a DB drop/recreate.

---

## Backend Architecture

**Entry point:** `main.py` — factory function `create_app()` registers all routers and CORS middleware.

**4-layer pattern:** Route → Service → Model → Schema

| Layer | Location | Role |
|-------|----------|------|
| Routes | `routes/*.py` | FastAPI routers, HTTP handlers, `Depends(get_db)` |
| Services | `services/*.py` | DB queries, business logic, raises `HTTPException` |
| Models | `models/*.py` | SQLAlchemy ORM table definitions |
| Schemas | `schemas/*.py` | Pydantic request/response models |

**Key routes beyond standard CRUD:**
- `GET /bulk-upload/template` — downloads a styled `.xlsx` template
- `POST /bulk-upload/preview` — parses uploaded Excel, returns rows as JSON (no DB writes)
- `POST /pdf/bol` — generates Bill of Lading PDF (reportlab)
- `POST /pdf/shipping-tag` — generates Freeman-style shipping tag PDF (reportlab)

**Database session:** `database/session.py` exports `get_db()` — use as a FastAPI dependency in every route that touches the DB.

**Settings:** `config/setting.py` uses `pydantic-settings` and reads from `backend/.env`. Only `DATABASE_URL` is active; JWT fields exist but are commented out.

---

## Frontend Architecture

**API client:** All backend calls go through `lib/api.ts`. It exports typed fetch wrappers (`fetchClients`, `createVenue`, etc.) and TypeScript interfaces for all entities. The base URL is hardcoded as `http://127.0.0.1:8000`.

**Pages (App Router):**

| Route | Purpose |
|-------|---------|
| `/` | Dashboard — navigation cards |
| `/clients` `/venues` `/expos` `/booths` `/expo-management` | CRUD pages for each entity |
| `/bulk-upload` | Upload Excel → preview table → per-row PDF buttons |
| `/print/bol` | Bill of Lading print page (reads data from URL query params) |
| `/print/shipping-tag` | Freeman shipping tag print page (two-panel, reads from URL params) |

**Print pages pattern:** `/print/bol` and `/print/shipping-tag` are client components that read row data from `useSearchParams()`, render the document as HTML/CSS, and call `window.print()` automatically on load. They have a `@media print` style block that hides the print button and sets `size: letter`.

**Tailwind note:** This project uses Tailwind CSS v4. Use `bg-linear-to-br` instead of `bg-gradient-to-br` (v4 breaking change).

---

## Domain Model

```
Country → State → City
                    ↓
              Venue (city_id)
                    ↓
ExpoMgmt ←── Expo (venue_id, expo_mgmt_id)
                    ↓
Client ←──── Booth (expo_id, partner_id → clients.id)
```

`Booth.partner_id` is the FK to `clients` (nullable) — this is the exhibiting company assigned to the booth.
