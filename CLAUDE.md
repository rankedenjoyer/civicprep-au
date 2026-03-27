# CivicPrep AU — CLAUDE.md

## Project Overview

A mobile-first Australian Citizenship Test prep app built with React Native (Expo)
and Supabase. Helps permanent residents pass the citizenship test through structured
lessons, realistic mock exams, flashcards, audio summaries, and mistake-driven revision.

**Positioning:** Study companion based on the official booklet. NOT an official
government app. Must include clear disclaimer and links to official resources.
No government seals, colors, or logos imitation.

---

## Tech Stack

- **Frontend:** React Native with Expo
- **Backend/DB:** Supabase
- **Auth:** Email + Google Sign-In (OAuth2) — planned post-MVP, see notes below
- **Admin panel:** Simple web dashboard to manage questions and lessons

---

## Database Schema

Tables: users, topics, lessons, questions, attempts, bookmarks,
flashcard_reviews, study_plans

Each question stores:

- topic
- source section from official booklet
- difficulty
- explanation
- whether it is a values question
- user performance stats

Each lesson module contains:

- 1-page summary
- 5–10 key points
- 5 flashcards
- 5 mini-quiz questions
- 1 short audio recap

---

## Core Features (MVP)

### A. Onboarding

- [ ] Ask: test date, English comfort level, daily study time, preferred mode
      (quiz / reading / audio / mixed)
- [ ] Generate study path: 7-day cram / 14-day balanced / 30-day mastery

### B. Study by Official Topic

Topics mirror official material:

1. Australia and its people
2. Australia's democratic beliefs, rights and liberties
3. Government and the law in Australia
4. Australian values

Each topic page: short summary notes, key facts, mini quiz, flashcards,
common traps/misconceptions

- [ ] Topic list screen with progress % and estimated time
- [ ] Lesson page per topic
- [ ] Flashcards page per topic

### C. Real Test Simulator (main selling feature)

- [ ] 20 questions, timed or untimed, 5 values questions included
- [ ] Scoring: fail immediately if values threshold not met; show overall
      score and pass/fail based on official rules
- [ ] Explanation after completion

### D. Question Bank (200–300 vetted questions)

- [ ] Multiple choice with "why this is right" explanation + official source ref
- [ ] Filters: by topic, difficulty, missed questions, values-only, bookmarked

### E. Flashcards

- [ ] Cover: national symbols, rights/responsibilities, government structure,
      important dates/events
- [ ] Modes: swipe cards, spaced repetition (v2), hard-cards-only

### F. Audio Learning (Skip for now)

- [ ] Short narrated chapter summaries
- [ ] Audio + transcript
- [ ] Slow-speed playback for learners

### G. Progress Dashboard

- [ ] Readiness score, strongest/weakest topic, values-question accuracy
- [ ] Number of full mock tests completed, streak, study minutes

### H. Mistake Review

- [ ] For every wrong answer: show correct answer, explain why, link to
      related lesson, save to "Review Later"

### I. Quick Cram Mode

- [ ] 50 most important facts, values-only rapid review, 10-minute mock,
      last-day checklist

---

## Navigation (5 tabs)

Home | Study | Practice | Review | Profile

### Screen List

- [ ] Splash / disclaimer
- [ ] Onboarding
- [ ] Home dashboard (today's goal, continue last lesson, start mock test,
      weak topic alert, test date countdown)
- [ ] Topic list
- [ ] Lesson page
- [ ] Flashcards page
- [ ] Quiz page
- [ ] Mock test page
- [ ] Results page
- [ ] Mistake review page
- [ ] Progress analytics page
- [ ] Settings / official links

---

## Progress Sync & Personalization

- [ ] Save test results and sync across devices via Supabase
- [ ] Track weak topics per user
- [ ] Resume sessions across devices
- [ ] Personalised study plan
- [ ] Streaks
- [ ] Per-user analytics

---

## AI Features (Skip for now)

### A. Simple Explanation Mode

User taps a question → gets plain English explanation, why other options
are wrong, related facts to remember.

### B. Weakness-Based Revision

AI identifies repeated mistakes and low-confidence areas → recommends
1 lesson, 10 flashcards, 1 mini quiz.
**Rule:** AI must answer only from vetted content aligned with official
material — never invent facts.

### C. Chat Tutor (v2)

User can ask topic questions in plain English. Scoped to official content only.

---

## Gamification (light touch — keep it serious and practical)

- Daily streak
- "Values Master" badge
- "3 mocks passed in a row" badge
- Confidence meter
- Weekly study goal

---

## UX & Design

- Calm, trustworthy, minimal — accessible for non-native English speakers
- Palette: white / navy / muted green
- Large readable fonts, very low clutter, clear progress indicators
- Adjustable text size, dark mode, simple English mode, audio support
- Dyslexia-friendly spacing, no long dense paragraphs on mobile

---

## No Monetization

No paywalls, no premium tiers, no gated content. All features free.

---

## Testing Protocol

**For every completed core module/model/feature:**

## Testing Protocol (STRICT)

You are permitted to start the application by calling npx expo start on the terminal, access localhost 8081 for testings.

For every feature:

1. Unit Tests

- Test pure logic (scoring, thresholds, plan generation)
- No UI, no DB
- Must cover edge cases

2. Integration Tests

- Test data flow between:
  - UI → API → DB
- Validate persistence and correctness

3. UI / E2E Tests (Playwright)

- Simulate real user flows:
  - onboarding → home
  - quiz → result
  - mock test → pass/fail
- Run against localhost

4. Execution Rules

- Automatically run all tests after implementation
- If ANY test fails → fix immediately
- Do NOT proceed to next feature until all tests pass

5. Required Commands

- npm test (unit/integration)
- npx playwright test (UI)

6. Output Requirements

- Show test results summary
- Show failing cases (if any)
- Confirm "ALL TESTS PASS" before moving on

Regression tests are also needed in case of updates on features or similar.

---

## Key Risks & Mitigations

- **Incorrect content:** Every question tied to official booklet section;
  content review workflow; versioning when booklet changes
- **Misleading branding:** Strong disclaimer on splash; official links in
  Profile; no gov seals or logo imitation
- **Overcomplicated app:** Prioritise quiz + revision + mock tests;
  keep lessons short

---

## Roadmap

### MVP (build first)

Onboarding → topic summaries → 200–300 question bank → full mock test
simulator → explanations → progress tracking → bookmarks → audio
summaries → official resource links

### Version 2

- Spaced repetition engine
- Multilingual glossary
- AI chat tutor
- Adaptive quiz difficulty
- Calendar-based study planner

### Post-MVP Auth (see notes below)

Authentication via OAuth2 (Google Sign-In) + Apple Sign-In + email.
Implement after all core features are stable.

---

## Authentication — Notes for When Ready

Once core features are complete, here's the recommended auth approach:

**Recommended:** Supabase Auth — already in the stack, handles OAuth2
natively, minimal extra setup.

**Sign-in methods to implement:**

1. Email + password (simplest, add first)
2. Google OAuth2 (highest priority — covers most users)
3. Apple Sign-In (required if shipping on iOS App Store)

**Why to do this after core features:**

- Auth adds session management complexity that slows down feature testing
- Supabase local dev works fine with anonymous/test users during MVP
- Once core flows are stable, dropping in Supabase Auth is straightforward
- Progress sync (already in scope) will plug directly into auth user IDs

**When you're ready, ask Claude:**

> "Implement Supabase Auth with email and Google OAuth2. Wire user IDs
> into the existing progress sync, study plans, streaks, and bookmarks tables."

---

## Current Status

**Working on:** [update this each session]
**Last completed:** [update this each session]
**Next up:** [update this each session]
**Blockers:**
