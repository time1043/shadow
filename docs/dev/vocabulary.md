# Frontend User Interaction

## Review Vocabulary via Keyboard Interactions

- [x] Users review vocabulary cards via keyboard interactions

- **Default**: card shows English word only
- **Left arrow**: mark as unknown (red card, stays on current word)
- **Right arrow**: mark as known (green card, auto-advance after 1s)
- **Up/Down arrows**: navigate between words

## Summary after All Words Reviewed

- [x] After all words reviewed, navigate to summary page showing known/unknown lists

## Review Vocabulary via Touch Gestures

- [x] Touch gesture support for mobile

Swipe mapping follows TikTok/Tinder conventions:

| Gesture     | Action                           | Keyboard Equivalent |
| ----------- | -------------------------------- | ------------------- |
| Swipe up    | Next word                        | ArrowDown           |
| Swipe down  | Previous word                    | ArrowUp             |
| Swipe left  | Mark as unknown (red, stay)      | ArrowLeft           |
| Swipe right | Mark as known (green, auto-next) | ArrowRight          |

- Card should animate out in the swipe direction (left/right)
- Vertical swipe is for navigation only, no marking
- Axis locking: once past a 10px deadzone, movement is locked to the dominant axis to prevent diagonal ambiguity

## Pronunciation

- [x] Auto-pronounce word when it appears (using Web Speech API, lang: en)
- [x] User can toggle pronunciation on/off
- [x] Tap/click on the word text area to pronounce it (click area should be tight to the word, not the entire card)

## Pagination

## Record

# UI Design

## Card

Fixed dimensions at each breakpoint, content overflow is clipped.

| Breakpoint | Width | Height |
| ---------- | ----- | ------ |
| base       | 288px | 256px  |
| sm         | 320px | 288px  |
| md         | 384px | 320px  |
| lg         | 448px | 320px  |

- Shows `#sortOrder` in top-left corner
- Only shows English word by default; explanation appears after marking
- Green border = known, red border = unknown, gray = unmarked

## Progress Indicator

- Shows up to 9 dots centered on current word
- Dots beyond the window are replaced with `…` ellipsis (clickable to jump)
- Dot colors: blue (current), green (known), red (unknown), gray (unmarked)

# Database Design (Planned)

## Two Core Tables

**words** — each word is unique by content

| Column  | Type    | Note          |
| ------- | ------- | ------------- |
| id      | PK      |               |
| content | VARCHAR | UNIQUE        |
| explain | TEXT    |               |
| more    | TEXT    | related words |

**buckets** — word collections / word lists

| Column | Type    | Note |
| ------ | ------- | ---- |
| id     | PK      |      |
| name   | VARCHAR |      |

## Junction Table (many-to-many)

A word can belong to multiple buckets. A bucket contains multiple words.

**bucket_words**

| Column     | Type | Note                               |
| ---------- | ---- | ---------------------------------- |
| bucket_id  | FK   | references buckets.id              |
| word_id    | FK   | references words.id                |
| sort_order | INT  | position of word within the bucket |

Primary key: `(bucket_id, word_id)`

Use spaced intervals for `sort_order` (e.g. 10, 20, 30...) to allow inserting between words without batch updates.

## Query Example

```sql
SELECT w.*, bw.sort_order
FROM bucket_words bw
JOIN words w ON w.id = bw.word_id
WHERE bw.bucket_id = ?
ORDER BY bw.sort_order;
```

## Why not Two Tables

If each word belongs to only one bucket, a `bucket_id` FK on `words` suffices. But this prevents reusing words across buckets. The junction table keeps it flexible.
