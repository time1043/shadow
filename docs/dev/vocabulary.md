# Frontend User Interaction

## Review Vocabulary via Keyboard Interactions

- [x] Users review vocabulary cards via keyboard interactions

- **Default**: card shows English word only
- **Left arrow**: mark as unknown (red card, stays on current word)
- **Right arrow**: mark as known (green card, auto-advance after 1s)
- **Up/Down arrows**: navigate between words

## Summary after All Words Reviewed

- [x] After all words reviewed, navigate to summary page showing known/unknown lists

## Review Vocabulary via

## Record

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
