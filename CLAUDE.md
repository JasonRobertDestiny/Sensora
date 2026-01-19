# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SENSORA is a neurophysiology-powered fragrance personalization platform for the L'Oreal Brandstorm 2026 competition. It creates bespoke perfume formulations based on emotional states (valence-arousal from text or EEG) and individual body chemistry (pH, skin type, temperature).

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt           # Minimal deps (Vercel-compatible)
pip install -r requirements-full.txt      # Full deps (local dev with RDKit, ChromaDB)
uvicorn app.main:app --reload             # Start dev server (localhost:8000)
pytest                                     # Run all tests
pytest tests/test_formulation.py -v       # Run single test file
pytest -k "test_generate"                 # Run tests matching pattern
```

## Architecture

### Data Flow
```
User Input → Calibration (pH/skin/temp) → Neuro-Brief (text → valence-arousal)
           → AI Service (OpenAI) or AetherAgent (local fallback)
           → Physio-RAG Corrections → IFRA Validation → Formula Output
```

### Frontend Structure
- `src/app/` - Next.js App Router pages: Landing(`/`), Calibration, Neuro-Brief, Result
- `src/stores/userProfileStore.ts` - Zustand state with persistence (key: `sensora-user-profile`). Holds calibration, neuro-brief, and formula across page transitions
- `src/lib/api.ts` - Backend API client wrapper

### Backend Structure
- `app/main.py` - FastAPI entry, CORS config, route registration
- `app/core/aether_agent.py` - Local formula orchestrator: retrieves Physio-RAG rules, generates base formula, applies corrections (fallback when no OpenAI key)
- `app/core/ai_service.py` - OpenAI GPT-4o integration for emotion-to-scent analysis (primary engine)
- `app/core/physio_rag.py` - Retrieval-augmented generation for physiological corrections. Uses ChromaDB + sentence-transformers when available, keyword matching fallback
- `app/chemistry/ifra_validator.py` - IFRA 51st Amendment compliance checker
- `app/chemistry/molecular_calc.py` - RDKit-based LogP and molecular weight calculations
- `app/chemistry/ingredient_db.py` - JSON ingredient database accessor
- `app/neuro/eeg_simulator.py` - Text-to-valence-arousal conversion (no EEG hardware required)
- `app/neuro/ph_analyzer.py` - pH strip image analysis via color matching
- `app/api/routes/` - REST endpoints: calibration, formulation, payment
- `data/` - JSON data files: 15 ingredients, 13 physio rules, IFRA standards

### Key Design Decisions
- Heavy dependencies (RDKit, sentence-transformers, ChromaDB) have graceful fallbacks for Vercel serverless
- OpenAI is primary AI engine; local AetherAgent is fallback when API key unavailable
- Formula generation always runs IFRA validation before returning

## API Endpoints

Base URL: `/api`

**Formulation**
- `POST /formulation/generate` - Main formula generation (requires profile_id, ph_value, skin_type)
- `POST /formulation/validate` - IFRA compliance check
- `POST /formulation/eeg-simulate` - Text-to-valence-arousal simulation
- `GET /formulation/ph-simulate/{skin_type}` - Demo pH values by skin type (dry/normal/oily)
- `POST /formulation/ph-analyze` - Analyze pH strip image (multipart upload)
- `POST /formulation/molecular-analysis` - RDKit molecular properties from SMILES
- `GET /formulation/ingredients` - List ingredients (filters: note_type, sustainable_only, family)

**Calibration**
- `POST /calibration/profile` - Create user profile

**Payment**
- PayPal integration endpoints for order processing

## Environment Variables

### Backend (`backend/.env`)
```
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
```

## Deployment

- Frontend: Vercel (Next.js auto-detection)
- Backend: Vercel serverless via `backend/api/index.py` entry point
- Production: deepscent.vercel.app
- Repository: github.com/JasonRobertDestiny/Sensora

## Domain Concepts

- **Valence-Arousal (V-A)**: Circumplex model of affect. Valence (-1 to +1) = pleasantness; Arousal (-1 to +1) = energy level
- **Physio-RAG**: 13 scientific rules that apply physiological corrections (e.g., dry skin → boost fixatives, oily skin → reduce heavy musks)
- **IFRA Compliance**: International Fragrance Association 51st Amendment safety standards. Category 1 = fine fragrance concentration limits
- **Note Pyramid**: Top (20%), Middle/Heart (35%), Base (45%) concentration ratios
- **LogP**: Octanol-water partition coefficient. Higher LogP = longer lasting on skin
