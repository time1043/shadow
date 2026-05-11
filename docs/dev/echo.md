Improve English through repetitive keyboard typing practice using TV script lines.

# Background

## Core Interaction

1. Display a sentence from the script as underscores — one underscore per character of each word, spaces between words
2. User types each word via keyboard
3. On correct input: word reveals, move to next word
4. On incorrect input: keep user's answer visible (expand underscores if needed), mark as wrong, move to next word
5. After completing the sentence, show summary (correct/total) and allow retry or next sentence

## Underscore Expansion

- Initial underscore length = standard answer length
- If user's input is longer than the standard answer, expand underscores to fit
- User's answer is always preserved as valuable input data

## Hints

Two independent toggle buttons (user can enable 0, 1, or 2):

| Hint          | Description                                           |
| ------------- | ----------------------------------------------------- |
| Pronunciation | Play audio of the sentence (Web Speech API, lang: en) |
| Chinese       | Show Chinese translation on page                      |

# Frontend User Interaction ‼️

## Mock Data

- [x] Static Doctor Who script data (mock)

## Typing Flow

- [ ] Word-by-word typing with underscore display
- [ ] Correct/incorrect feedback with answer preservation
- [ ] Underscore expansion for longer inputs
- [ ] Pronunciation hint toggle
- [ ] Chinese translation hint toggle

## Page Layout

- Top: hint toggles (pronunciation, chinese) — two independent toggle buttons
- Center: current sentence with underscores, current word highlighted
- Bottom: sentence progress indicator (word N / total), keyboard hints

## Interaction Details

1. Page loads → show first sentence as underscores (one `_` per character, spaces between words)
2. User types a word → press Space or Enter to submit
3. If correct: word reveals in green, auto-focus next word
4. If incorrect: user's answer shown in red (expand underscores if needed), auto-focus next word
5. After last word: show summary (correct/total), buttons for "Retry" and "Next Sentence"
6. Hint buttons: toggle independently, affect current sentence only

# Data Model (Planned)

## Content Structure

**course** — a course contains multiple lessons

| Column | Type    | Note                   |
| ------ | ------- | ---------------------- |
| id     | PK      |                        |
| title  | VARCHAR | e.g. "Doctor Who S1E1" |
| source | TEXT    | attribution (optional) |

**lesson** — a lesson contains multiple lines

| Column     | Type    | Note                     |
| ---------- | ------- | ------------------------ |
| id         | PK      |                          |
| course_id  | FK      | references courses.id    |
| title      | VARCHAR | e.g. "Opening Monologue" |
| sort_order | INT     | position within course   |

**line** — individual lines from a lesson

| Column      | Type    | Note                   |
| ----------- | ------- | ---------------------- |
| id          | PK      |                        |
| lesson_id   | FK      | references lessons.id  |
| sort_order  | INT     | position within lesson |
| content     | TEXT    | English line           |
| translation | TEXT    | Chinese translation    |
| speaker     | VARCHAR | character name         |

## Parser (Planned)

User creates a course, then provides script via:

- File upload
- Form input

Parser converts raw script into structured lines (course → lesson → line).

**attempts** — user input data, see [Record](./record.md) module
