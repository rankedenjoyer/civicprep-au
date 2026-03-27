# CivicPrep AU — Manual QA Checklist

**How to use:**

- Run the app in the iOS Simulator (or Android) via `npx expo start`
- Go through each section in order
- Mark each item: ✅ Pass · ❌ Fail · ⚠️ Partial · N/A
- Note any bugs in the **Notes** column

---

## 1. Onboarding

Fresh install — no prior data. App should land on Onboarding screen.

| #    | Step                                           | Expected Result                                                                          | Result | Notes |
| ---- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | ----- |
| 1.1  | Launch app with no stored data                 | Onboarding screen shown (not Home)                                                       |        |       |
| 1.2  | Welcome screen — check content                 | Shows "CivicPrep AU" title, tagline, disclaimer box mentioning "Our Common Bond" booklet |        |       |
| 1.3  | Welcome screen — disclaimer text               | Disclaimer says "not affiliated with or endorsed by the Australian Government"           |        |       |
| 1.4  | Tap "Get Started"                              | Advances to "When is your test?" step                                                    |        |       |
| 1.5  | Test date step — select "In less than 2 weeks" | Option highlights (blue border + checkmark)                                              |        |       |
| 1.6  | Test date step — tap "Back"                    | Returns to Welcome screen                                                                |        |       |
| 1.7  | Test date step — tap "Next" without selecting  | Advances to English level step (selection optional)                                      |        |       |
| 1.8  | English level — select "Beginner"              | Option highlights                                                                        |        |       |
| 1.9  | English level — change selection to "Advanced" | Previous option deselects, new one highlights                                            |        |       |
| 1.10 | Progress bar                                   | Advances at each step (wider each time)                                                  |        |       |
| 1.11 | Daily time step — select "30 minutes"          | Option highlights                                                                        |        |       |
| 1.12 | Study mode step — three options visible        | Quiz, Reading, Mixed all shown with sub-text                                             |        |       |
| 1.13 | Study plan step — select "14-Day Balanced"     | Option highlights                                                                        |        |       |
| 1.14 | Tap "Start Studying" on plan step              | Navigates to Home screen (not Onboarding)                                                |        |       |
| 1.15 | After onboarding — relaunch app                | Goes directly to Home (onboarding not shown again)                                       |        |       |
| 1.16 | Select "7-Day Cram" plan then finish           | Profile screen shows "7-Day Cram Plan"                                                   |        |       |
| 1.17 | Select "30-Day Mastery" plan then finish       | Profile screen shows "30-Day Mastery Plan"                                               |        |       |

---

## 2. Home Screen

_Precondition: Onboarding complete with 14-Day Balanced plan selected._

| #    | Step                                      | Expected Result                                                                   | Result | Notes |
| ---- | ----------------------------------------- | --------------------------------------------------------------------------------- | ------ | ----- |
| 2.1  | Open Home tab                             | Shows "Good day!" header, streak badge, Readiness Score card                      |        |       |
| 2.2  | Readiness Score (fresh start)             | Shows 0% readiness, "Keep studying" hint text                                     |        |       |
| 2.3  | Stats row                                 | Three stat cards: Accuracy (0%), Questions (0), Mock Tests (0)                    |        |       |
| 2.4  | Quick Practice section                    | Four cards: Full Mock Test, Values Focus, Study Topics, Review                    |        |       |
| 2.5  | Tap "Full Mock Test" quick card           | Navigates to Mock Test intro screen                                               |        |       |
| 2.6  | Tap "Values Focus" quick card             | Starts a Values quiz (shows 1/10 counter)                                         |        |       |
| 2.7  | Tap "Study Topics" quick card             | Navigates to Study tab                                                            |        |       |
| 2.8  | Tap "Review" quick card                   | Navigates to Review tab                                                           |        |       |
| 2.9  | Topics to Study section                   | Shows all 4 topics: People & History, Rights & Freedoms, Government & Law, Values |        |       |
| 2.10 | Each topic row has a progress bar         | Progress bar shows 0% initially                                                   |        |       |
| 2.11 | Tap a topic row                           | Navigates to that topic's detail screen (via Study tab)                           |        |       |
| 2.12 | Weak area alert — fresh start             | Alert NOT shown (requires >5 questions answered)                                  |        |       |
| 2.13 | After answering >5 questions in one topic | Weak area alert appears for the topic with lowest progress                        | ✅     |       |
| 2.14 | Tap weak area alert card                  | Navigates to that topic's detail screen                                           | ✅     |       |
| 2.15 | Streak badge (fresh)                      | Shows 0 (flame icon visible)                                                      | ⚠️     | Shows 0 on first day — increments after consecutive day; needs multi-day test |

---

## 3. Study Tab — Topic List

| #   | Step               | Expected Result                                       | Result | Notes |
| --- | ------------------ | ----------------------------------------------------- | ------ | ----- |
| 3.1 | Tap Study tab      | Shows 4 topic cards with full names                   | ✅     |       |
| 3.2 | Topic 1 visible    | "Australia and Its People" with icon and color accent | ✅     |       |
| 3.3 | Topic 2 visible    | "Democratic Beliefs, Rights and Liberties"            | ✅     |       |
| 3.4 | Topic 3 visible    | "Government and the Law in Australia"                 | ✅     |       |
| 3.5 | Topic 4 visible    | "Australian Values"                                   | ✅     |       |
| 3.6 | Tap any topic card | Opens Topic Detail screen for that topic              | ✅     |       |

---

## 4. Topic Detail Screen

_Test with "Australia and Its People"._

| #   | Step                                      | Expected Result                                                         | Result | Notes |
| --- | ----------------------------------------- | ----------------------------------------------------------------------- | ------ | ----- |
| 4.1 | Open topic detail                         | Hero section shows topic color, title, lesson/question/flashcard counts | ✅     |       |
| 4.2 | First lesson is expanded                  | Key Points section visible, list of points shown                        | ✅     |       |
| 4.3 | Tap expanded lesson header                | Lesson collapses (key points hidden)                                    | ✅     |       |
| 4.4 | Tap collapsed lesson header               | Lesson expands (key points visible again)                               | ✅     |       |
| 4.5 | Multiple lessons visible                  | Can scroll to see all lessons for the topic                             | ✅     |       |
| 4.6 | "Quiz" button visible in action row       | Tapping it navigates to QuizScreen with topicId set                     | ✅     |       |
| 4.7 | "Flashcards" button visible in action row | Tapping it navigates to FlashcardsScreen for that topic                 | ✅     |       |
| 4.8 | Back navigation                           | Hardware back / swipe returns to Study tab topic list                   | ✅     |       |

---

## 5. Quiz Engine

### 5A. Starting a Quiz

| #   | Step                                                  | Expected Result                                                     | Result | Notes |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------- | ------ | ----- |
| 5.1 | Start topic quiz (Practice > topic)                   | Shows quiz header with progress pills and "1/10" counter            | ✅     | Fixed: was broken due to navigation.navigate cross-stack; now uses push() |
| 5.2 | Start Random 10 (Practice > Random 10)                | Shows "1/10", questions from mixed topics                           | ✅     | Fixed: same push() fix |
| 5.3 | Start Values Focus (Practice > Values Questions Only) | Shows "1/10", all questions show "Values Question — Critical" badge | ✅     | Fixed: same push() fix |
| 5.4 | Question text visible                                 | Large bold text, readable                                           |        |       |
| 5.5 | Four answer options shown                             | Each has A/B/C/D letter badge                                       |        |       |

### 5B. Answering Questions

| #    | Step                                           | Expected Result                                                                 | Result | Notes |
| ---- | ---------------------------------------------- | ------------------------------------------------------------------------------- | ------ | ----- |
| 5.6  | Tap correct answer                             | Option turns green, checkmark icon appears, explanation box shows               | ✅     |       |
| 5.7  | Tap wrong answer                               | Selected option turns red with X, correct option turns green, explanation shows | ✅     |       |
| 5.8  | Tap option after answering                     | No effect (cannot change answer)                                                | ✅     |       |
| 5.9  | Explanation box — correct                      | Shows "Correct!" in green, explanation text, source reference                   | ✅     |       |
| 5.10 | Explanation box — wrong                        | Shows "Incorrect" in red, explanation text, source reference                    | ✅     |       |
| 5.11 | Bookmark icon in explanation                   | Bookmark-outline icon visible                                                   | ✅     |       |
| 5.12 | Tap bookmark icon                              | Icon changes to filled bookmark                                                 | ✅     |       |
| 5.13 | Tap bookmark icon again                        | Icon reverts to outline (toggled off)                                           | ✅     |       |
| 5.14 | "Next Question" button visible after answering | Tapping advances to next question                                               | ✅     |       |
| 5.15 | Progress pills update                          | Answered question pill turns green (correct) or red (wrong)                     | ✅     |       |
| 5.16 | Counter updates                                | "2/10" shown after advancing                                                    | ✅     |       |
| 5.17 | Last question — button label changes           | Shows "See Results" instead of "Next Question"                                  | ✅     |       |
| 5.18 | Values badge on values questions               | "Values Question — Critical" badge shown in yellow above question text          | ✅     |       |

### 5C. Results Screen

| #    | Step                          | Expected Result                                    | Result | Notes |
| ---- | ----------------------------- | -------------------------------------------------- | ------ | ----- |
| 5.19 | Complete all 10 questions     | Results screen shown with score circle             | ✅     |       |
| 5.20 | Score ≥ 75%                   | Circle border green, "Well done!" message          | ✅     |       |
| 5.21 | Score < 75%                   | Circle border red, "Keep practising!" message      | ✅     |       |
| 5.22 | Question review list          | All 10 questions listed with green tick or red X   | ✅     |       |
| 5.23 | Tap "Done"                    | Returns to previous screen (Practice tab)          | ✅     |       |
| 5.24 | Tap "Try Again"               | Quiz restarts from question 1 with same topic/mode | ✅     |       |
| 5.25 | After Try Again — fresh state | Counter resets to "1/10", no options pre-selected  | ✅     |       |

### 5D. Edge Cases

| #    | Step                          | Expected Result                          | Result | Notes |
| ---- | ----------------------------- | ---------------------------------------- | ------ | ----- |
| 5.26 | Close quiz mid-way (X button) | Returns to Practice tab, no crash        | ✅     |       |
| 5.27 | All wrong answers             | Score 0%, red circle, "Keep practising!" | ✅     |       |
| 5.28 | All correct answers           | Score 100%, green circle, "Well done!"   | ✅     |       |

---

## 6. Mock Test

### 6A. Intro Screen

| #   | Step                                            | Expected Result                                                                    | Result | Notes |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------- | ------ | ----- |
| 6.1 | Navigate to Practice > Official-Style Mock Test | Mock Test intro screen shown                                                       |        |       |
| 6.2 | Intro screen info cards                         | Shows: "20 Questions", "5 Values Questions", "Pass Mark 15/20 (75%)", "45 Minutes" |        |       |
| 6.3 | Timed mode toggle — default state               | Toggle is ON (blue) by default                                                     |        |       |
| 6.4 | Tap timed mode toggle                           | Toggle turns grey (OFF), thumb moves left                                          |        |       |
| 6.5 | Tap toggle again                                | Toggle turns blue (ON) again                                                       |        |       |
| 6.6 | Tap back button                                 | Returns to Practice screen                                                         |        |       |

### 6B. Taking the Test

| #    | Step                            | Expected Result                                                                | Result | Notes |
| ---- | ------------------------------- | ------------------------------------------------------------------------------ | ------ | ----- |
| 6.7  | Tap "Start Test"                | Test begins, shows "1 / 20" counter, progress bar                              |        |       |
| 6.8  | Timed mode ON — timer visible   | Timer badge shows "45:00" countdown in header                                  |        |       |
| 6.9  | Timed mode OFF — timer hidden   | No timer badge shown                                                           |        |       |
| 6.10 | Values questions in test        | Show "Values Question" purple badge                                            |        |       |
| 6.11 | Answer a question               | Correct = green, wrong = red, explanation shown (no Source: reference in mock) |        |       |
| 6.12 | "Next Question" button          | Advances to next question                                                      |        |       |
| 6.13 | Last question button label      | Shows "Finish Test" instead of "Next Question"                                 |        |       |
| 6.14 | Tap X (quit button) during test | Modal appears: "Quit Test? Your progress will be lost."                        |        |       |
| 6.15 | Tap "Keep Going" in quit modal  | Modal dismisses, test continues from same question                             |        |       |
| 6.16 | Tap "Quit" in quit modal        | Returns to Practice screen, test abandoned; re-entering Mock Test shows intro  |        | BUG FIXED: was showing mid-session test with stopped clock; state now resets on quit |
| 6.17 | Correct count in header         | "N correct" updates as questions are answered                                  |        |       |
| 6.18 | Progress bar                    | Fills as questions are completed                                               |        |       |

### 6C. Results — Pass

| #    | Step                                                 | Expected Result                                               | Result | Notes |
| ---- | ---------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 6.19 | Complete test with ≥15 correct AND ≥3 values correct | Green "Test Passed!" banner                                   |        |       |
| 6.20 | Results score breakdown                              | Shows: Overall Score (X/20), Values Score (X/5), Accuracy (%) |        |       |
| 6.21 | Overall score status                                 | Shows "✓ Passed" if ≥15                                       |        |       |
| 6.22 | Values score status                                  | Shows "✓ Passed" if ≥3                                        |        |       |

### 6D. Results — Fail (Various Reasons)

| #    | Step                                                       | Expected Result                                                        | Result | Notes |
| ---- | ---------------------------------------------------------- | ---------------------------------------------------------------------- | ------ | ----- |
| 6.23 | Complete test with <15 correct (even if values OK)         | Red "Test Not Passed" banner, message mentions score too low           |        |       |
| 6.24 | Complete test with <3 values correct (even if overall ≥15) | Red "Test Not Passed" banner, message mentions values questions failed |        |       |
| 6.25 | Values fail message                                        | Shows "Values questions failed (X/5). Need at least 3."                |        |       |
| 6.26 | Overall fail message                                       | Shows "Score too low (X%). Need 75% to pass."                          |        |       |
| 6.27 | Tap "Try Again" on results                                 | Returns to intro screen (not mid-test)                                 |        |       |
| 6.28 | Tap "Done" on results                                      | Returns to Practice screen                                             |        |       |

### 6E. Cram Mode (Quick Cram section)

| #    | Step                                  | Expected Result                                   | Result | Notes |
| ---- | ------------------------------------- | ------------------------------------------------- | ------ | ----- |
| 6.29 | Practice > Quick Cram > "10-min Mock" | Opens Mock Test intro with timed mode already OFF |        | BUG FIXED: was showing 45-min timed test; cramMode param was lost via cross-stack navigate(); now uses push() |

---

## 7. Flashcards

### 7A. Opening Flashcards

| #   | Step                              | Expected Result                                                                       | Result | Notes |
| --- | --------------------------------- | ------------------------------------------------------------------------------------- | ------ | ----- |
| 7.1 | Study > topic > Flashcards button | Opens flashcards for that topic                                                       |        |       |
| 7.2 | Practice > All Flashcards         | Opens flashcards with all topics combined                                             |        |       |
| 7.3 | Flashcard screen header           | Shows topic name (or "All Flashcards"), card counter "1 / N"                          |        |       |
| 7.4 | Initial state                     | Front of card shows "QUESTION" label, question text, "Tap card to reveal answer" hint |        |       |

### 7B. Interaction

| #    | Step                             | Expected Result                                   | Result | Notes |
| ---- | -------------------------------- | ------------------------------------------------- | ------ | ----- |
| 7.5  | Tap card                         | Card flips to show "ANSWER" label and answer text |        |       |
| 7.6  | Tap card again                   | Card flips back to question side                  |        |       |
| 7.7  | Tap forward arrow (→)            | Advances to next card, counter updates to "2 / N" |        |       |
| 7.8  | Card resets on advance           | New card shows QUESTION side (not flipped)        |        |       |
| 7.9  | Tap back arrow (←) on first card | Arrow is greyed out / no action                   |        |       |
| 7.10 | Tap back arrow on card 3         | Navigates back to card 2                          |        |       |
| 7.11 | Progress bar                     | Fills as cards advance                            |        |       |

### 7C. Mark as Hard

| #    | Step                                       | Expected Result                                                          | Result | Notes |
| ---- | ------------------------------------------ | ------------------------------------------------------------------------ | ------ | ----- |
| 7.12 | Tap "Mark as hard" on a card               | Button changes to "Marked hard" (red flag icon), background tint changes |        |       |
| 7.13 | Tap "Marked hard"                          | Reverts to "Mark as hard" (unflagged)                                    |        |       |
| 7.14 | Mark card as hard, advance away, come back | Card still shows "Marked hard" state                                     |        |       |
| 7.15 | Mark 2 cards as hard, check Profile        | "Hard Flashcards: 2 cards" shown in Profile settings                     |        |       |

### 7D. Completion

| #    | Step                      | Expected Result                               | Result | Notes |
| ---- | ------------------------- | --------------------------------------------- | ------ | ----- |
| 7.16 | Tap → on the last card    | "All done!" screen shown with green checkmark |        |       |
| 7.17 | Done screen text          | Shows "You reviewed all N flashcards."        |        |       |
| 7.18 | Tap "Review Again"        | Returns to first card (card 1)                |        |       |
| 7.19 | Tap "Done" on done screen | Returns to previous screen                    |        |       |

### 7E. Hard Cards Filter

| #    | Step                                                                 | Expected Result                                       | Result | Notes |
| ---- | -------------------------------------------------------------------- | ----------------------------------------------------- | ------ | ----- |
| 7.20 | Practice > Hard Flashcards (requires at least 1 card marked as hard) | Opens flashcards filtered to only hard-marked cards   |        | ADDED: "Hard Flashcards" card now in Practice > Flashcards section |
| 7.21 | Practice > Hard Flashcards with no hard cards marked                 | Shows "No flashcards here — No hard cards marked yet" |        |       |

---

## 8. Practice Hub

| #    | Step                                                 | Expected Result                                                                          | Result | Notes |
| ---- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | ----- |
| 8.1  | Open Practice tab                                    | Shows "Test Formats", "Practice by Topic", "Flashcards", "Quick Cram" sections          |        |       |
| 8.2  | "Official-Style Mock Test" card                      | Navigates to Mock Test intro                                                             |        |       |
| 8.3  | "Values Questions Only" card                         | Starts values quiz (10 questions, all values)                                            |        | FIXED: now uses navigation.push() |
| 8.4  | "Random 10 Questions" card                           | Starts quiz with 10 random mixed questions                                               |        | FIXED: now uses navigation.push() |
| 8.5  | Practice by Topic — 4 topics shown                   | People & History, Rights & Freedoms, Government & Law, Values                            |        |       |
| 8.6  | Tap a topic in "Practice by Topic"                   | Starts 10-question topic quiz (not topic detail)                                         |        | FIXED: now uses navigation.push() |
| 8.7  | "All Flashcards" card                                | Opens flashcard screen with all cards                                                    |        | FIXED: now uses navigation.push() |
| 8.8  | "Hard Flashcards" card                               | Opens flashcards filtered to hard-marked cards only                                      |        | NEW: added in this session |
| 8.9  | Quick Cram — "10-min Mock" button                    | Opens Mock Test in cram mode                                                             |        |       |
| 8.10 | Quick Cram — "Values Only" button                    | Starts values quiz                                                                       |        | FIXED: now uses navigation.push() |
| 8.11 | After completing a mock test — "Last Mock Test" card | Appears on Practice screen with score and pass/fail                                      |        |       |
| 8.12 | Last mock test card — passed                         | Green border, "Passed" text, score shown                                                 |        |       |
| 8.13 | Last mock test card — not passed                     | Red border, "Not Passed" text                                                            |        |       |

---

## 9. Review Tab

### 9A. Empty States

| #   | Step                           | Expected Result                                            | Result | Notes |
| --- | ------------------------------ | ---------------------------------------------------------- | ------ | ----- |
| 9.1 | Open Review tab (fresh)        | Shows Mistakes/Bookmarks/History tabs, Mistakes tab active | ✅     |       |
| 9.2 | Mistakes tab — no mistakes yet | "No mistakes yet" empty state with green checkmark icon    | ✅     |       |
| 9.3 | Bookmarks tab                  | Tap Bookmarks tab — "No bookmarks yet" empty state         | ✅     |       |
| 9.4 | History tab                    | Tap History tab — "No tests taken yet" empty state         | ✅     |       |

### 9B. Mistakes

| #   | Step                                          | Expected Result                                                               | Result | Notes |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------- | ------ | ----- |
| 9.5 | Answer a question wrong twice (same question) | That question appears in Mistakes tab                                         |        |       |
| 9.6 | Mistake card content                          | Shows question text, correct answer (✓), explanation, topic badge, accuracy % |        |       |
| 9.7 | Mistakes tab badge                            | Red badge shows count of mistake questions                                    |        |       |
| 9.8 | "Practice These Questions" button             | Visible when mistakes exist; starts a random 10 quiz                          |        |       |
| 9.9 | Question with >60% accuracy                   | Does NOT appear in Mistakes (threshold is <60%)                               |        |       |

### 9C. Bookmarks

| #    | Step                                               | Expected Result                                               | Result | Notes |
| ---- | -------------------------------------------------- | ------------------------------------------------------------- | ------ | ----- |
| 9.10 | Bookmark a question during quiz                    | Navigating to Review > Bookmarks shows that question          |        |       |
| 9.11 | Bookmarked question card                           | Shows question text, correct answer, explanation, topic badge |        |       |
| 9.12 | Tap bookmark icon on bookmarked question in Review | Question is removed from Bookmarks (unbookmarked)             |        |       |
| 9.13 | Bookmark count in Profile                          | Updates to reflect current bookmark count                     |        |       |
| 9.14 | Bookmark persists after app restart                | Re-launch app; bookmarked question still in Bookmarks tab     |        |       |

### 9D. History

| #    | Step                      | Expected Result                                                         | Result | Notes |
| ---- | ------------------------- | ----------------------------------------------------------------------- | ------ | ----- |
| 9.15 | Complete a mock test      | Test result card appears in History tab                                 |        |       |
| 9.16 | History card — passed     | Green border, "Passed" status, date, Score X/20, Accuracy %, Values X/5 |        |       |
| 9.17 | History card — not passed | Red border, "Not Passed" status                                         |        |       |
| 9.18 | Multiple tests            | Each appears as a separate card, newest first                           |        |       |
| 9.19 | History count text        | Shows "N mock tests completed"                                          |        |       |

---

## 10. Profile Screen

| #     | Step                                      | Expected Result                                                                       | Result | Notes |
| ----- | ----------------------------------------- | ------------------------------------------------------------------------------------- | ------ | ----- |
| 10.1  | Open Profile tab                          | Shows "My Profile" header with plan name in subtitle                                  |        |       |
| 10.2  | Stats grid — 6 stats shown                | Readiness, Streak, Accuracy, Answered, Mock Tests, Tests Passed                       |        |       |
| 10.3  | Fresh stats                               | Readiness 0%, Streak 0 days, Accuracy 0%, Answered 0, Mock Tests 0, Tests Passed 0    |        |       |
| 10.4  | After answering questions                 | Answered count and Accuracy update                                                    |        |       |
| 10.5  | After passing a mock test                 | Mock Tests count = 1, Tests Passed = 1                                                |        |       |
| 10.6  | Study Settings section                    | Shows: Study Plan, Daily Goal, English Level, Bookmarked count, Hard Flashcards count |        |       |
| 10.7  | Study Plan setting                        | Shows plan selected in onboarding (e.g. "14-Day Balanced Plan")                       |        |       |
| 10.8  | "Edit preferences" link                   | Tapping navigates to Onboarding screen                                                |        |       |
| 10.9  | Official Resources section                | Visible with disclaimer box                                                           |        |       |
| 10.10 | Disclaimer text                           | Says "not affiliated with" Australian Government                                      |        |       |
| 10.11 | "Official Citizenship Test Info" link     | Visible and tappable (opens external URL)                                             |        | BUG FIXED: old URL returned 404; now points to correct page (2026-03-26) |
| 10.12 | "Download 'Our Common Bond' Booklet" link | Visible and tappable — opens Our Common Bond page (not direct PDF)                    |        | BUG FIXED: old PDF URL returned 404; now links to official booklet page (2026-03-26) |
| 10.13 | "Official Practice Test" link             | Visible and tappable (opens practice test page)                                       |        | BUG FIXED: old URL returned 404; now points to correct practice test page (2026-03-26) |
| 10.14 | About section                             | Mentions "Our Common Bond" booklet, version number "Version 1.0.0"                    |        |       |
| 10.15 | "Reset All Progress" button               | Visible at bottom, red text                                                           |        |       |
| 10.16 | Tap "Reset All Progress"                  | Modal appears: "Reset All Data?" with warning text                                    |        |       |
| 10.17 | Tap "Cancel" in reset modal               | Modal dismisses, no data changed                                                      |        |       |
| 10.18 | Tap "Reset" in reset modal                | App clears all data and returns to Onboarding screen                                  |        |       |

---

## 11. Data Persistence & State

| #    | Step                                     | Expected Result                                                    | Result | Notes |
| ---- | ---------------------------------------- | ------------------------------------------------------------------ | ------ | ----- |
| 11.1 | Complete quiz → close app → reopen       | Progress stats (questions answered, accuracy) persist              |        |       |
| 11.2 | Bookmark question → close app → reopen   | Bookmark still appears in Review > Bookmarks                       |        |       |
| 11.3 | Mark flashcard hard → close app → reopen | Hard card still flagged when reopening flashcards                  |        |       |
| 11.4 | Complete mock test → close app → reopen  | Test result still in Review > History                              |        |       |
| 11.5 | Topic progress updates after quiz        | Home screen topic progress bar increases for that topic            |        |       |
| 11.6 | Readiness score updates                  | After answering questions correctly, Readiness % increases         |        |       |
| 11.7 | Mock Tests counter                       | Home screen "Mock Tests" stat increments after each completed mock |        |       |

---

## 12. Scoring Logic Edge Cases

| #     | Step                                        | Expected Result                                                                   | Result | Notes |
| ----- | ------------------------------------------- | --------------------------------------------------------------------------------- | ------ | ----- |
| 12.1  | Mock test: score 15/20, values 3/5          | "Test Passed!" (both thresholds met)                                              |        |       |
| 12.2  | Mock test: score 15/20, values 2/5          | "Test Not Passed" — values message shown                                          |        |       |
| 12.3  | Mock test: score 14/20, values 5/5          | "Test Not Passed" — score too low message shown                                   |        |       |
| 12.4  | Mock test: score 20/20, values 0/5          | "Test Not Passed" — values message (0 < 3)                                        |        |       |
| 12.5  | Mock test: exactly 15/20 correct            | Pass (15 is the minimum pass score)                                               |        |       |
| 12.6  | Quiz score exactly 75% (e.g. 7.5/10 → 8/10) | "Well done!" (>= 75%)                                                             |        |       |
| 12.7  | Quiz score 70% (7/10)                       | "Keep practising!" (< 75%)                                                        |        |       |
| 12.8  | Mistake threshold                           | Answer same question wrong 3 out of 3 times → <60% accuracy → appears in Mistakes |        |       |
| 12.9  | Mistake threshold — not triggered           | Answer question wrong 1 out of 3 times (33% accuracy < 60%) → appears in Mistakes |        |       |
| 12.10 | Mistake threshold — high accuracy           | Answer question correct 4 out of 5 times (80%) → does NOT appear in Mistakes      |        |       |

---

## 13. Navigation

| #     | Step                                    | Expected Result                                         | Result | Notes |
| ----- | --------------------------------------- | ------------------------------------------------------- | ------ | ----- |
| 13.1  | All 5 tabs visible                      | Home, Practice, Study, Review, Profile tabs all present | ✅     |       |
| 13.2  | Tab switching                           | Tapping each tab switches the view correctly            | ✅     |       |
| 13.3  | Active tab highlighted                  | Current tab indicator visible                           | ✅     |       |
| 13.4  | Back from quiz (X button)               | Returns to Practice or Study, not Home                  | ✅     |       |
| 13.5  | Back from flashcards (← button)         | Returns to previous screen                              | ✅     |       |
| 13.6  | Back from topic detail                  | Returns to Study tab topic list                         | ✅     |       |
| 13.7  | Back from mock test intro (← button)    | Returns to Practice tab                                 | ✅     |       |
| 13.8  | Deep navigation — Home > Full Mock Test | Opens Mock Test, back returns to Practice (or Home)     |        |       |
| 13.9  | Deep navigation — Home > Values Focus   | Opens Values quiz                                       |        |       |
| 13.10 | Deep navigation — Home > topic row      | Opens topic detail screen                               |        |       |
| 13.11 | Switch tabs during quiz (if possible)   | Quiz state preserved or user warned                     |        |       |

---

## 14. UI & Accessibility

| #    | Step                         | Expected Result                                                             | Result | Notes |
| ---- | ---------------------------- | --------------------------------------------------------------------------- | ------ | ----- |
| 14.1 | Scroll on Home               | All content accessible by scrolling                                         | ✅     |       |
| 14.2 | Scroll on Profile            | All content accessible by scrolling                                         | ✅     |       |
| 14.3 | Scroll on Practice           | All sections accessible by scrolling                                        | ✅     |       |
| 14.4 | Scroll inside Quiz           | Long questions scrollable, options accessible                               |        |       |
| 14.5 | Large text (accessibility)   | Enable larger text in device settings — content still readable, no overflow |        |       |
| 14.6 | Landscape orientation        | App usable in landscape (no critical clipping)                              |        |       |
| 14.7 | Navy / white color scheme    | No garish colors; calm palette throughout                                   | ✅     |       |
| 14.8 | No government seals or logos | No imitation of official government branding anywhere                       | ✅     |       |
| 14.9 | Disclaimer visible           | Not buried — visible on welcome screen and Profile page                     | ✅     |       |

---

## 15. Streak Behaviour

| #    | Step                          | Expected Result                                 | Result | Notes |
| ---- | ----------------------------- | ----------------------------------------------- | ------ | ----- |
| 15.1 | First day of use              | Streak shows 1 (or 0) on Home screen badge      |        |       |
| 15.2 | Study on two consecutive days | Streak increments                               |        |       |
| 15.3 | Skip a day                    | Streak resets to 0 or 1                         |        |       |
| 15.4 | Streak shown in Profile       | Profile "Streak" stat matches Home badge number |        |       |

---

## Bug Log

| #   | Screen        | Description                                                                                                 | Severity | Status  |
| --- | ------------- | ----------------------------------------------------------------------------------------------------------- | -------- | ------- |
| B1  | Mock Test     | After quitting mid-test, clicking Practice tab again showed the in-progress test with a stopped timer       | High     | ✅ Fixed — state resets to intro on quit (2026-03-26) |
| B2  | Practice Hub  | Values Questions Only, Random 10, Practice by Topic, All Flashcards buttons did not navigate               | High     | ✅ Fixed — changed navigation.navigate() to navigation.push() to prevent cross-stack resolution (2026-03-26) |
| B3  | Practice Hub  | No "Hard Flashcards" option to access hard-only filter                                                      | Medium   | ✅ Fixed — added "Hard Flashcards" card in Practice > Flashcards section (2026-03-26) |
| B4  | Profile       | All three official government links returned 404 / not authorized                                          | High     | ✅ Fixed — updated to current immi.homeaffairs.gov.au URLs (2026-03-26) |
| B5  | Practice Hub  | "10-min Mock" cram mode showed full 45-min timed test instead of timer-off version                         | High     | ✅ Fixed — cramMode param was dropped by cross-stack navigate(); now uses push() (2026-03-26) |

---

_Last updated: 2026-03-26_
_Tested by: Manual — Expo Go_
_Device/Simulator: Physical device via Expo Go_
_Expo SDK version: (fill in)_
