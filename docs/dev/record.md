# Record

Learning history module. Stores user activity across all modules using PostgreSQL JSONB for flexible metadata.

## Design

Use a single `records` table with a `meta` JSONB column. Each module defines its own meta schema.

**records**

| Column    | Type      | Note                                |
| --------- | --------- | ----------------------------------- |
| id        | PK        |                                     |
| module    | VARCHAR   | "vocabulary", "echo", etc.          |
| module_id | INT       | FK to the module's primary entity   |
| meta      | JSONB     | module-specific metadata            |
| created_at| TIMESTAMP |                                     |

Index on `(module, module_id)` and `(module, created_at)`.

## Meta Schemas by Module

### Vocabulary

```json
{
  "word": "responsibility",
  "status": "known" | "unknown"
}
```

### Echo

```json
{
  "line_id": 3,
  "speaker": "Doctor12",
  "user_input": "It moves slowly but it never stops...",
  "is_correct": false,
  "hints_used": ["pronunciation", "chinese"],
  "time_spent_ms": 12000,
  "attempt_number": 2
}
```

## UI (Planned)

- Timeline view of learning history
- Filter by module (vocabulary / echo)
- Stats: accuracy rate, practice duration, streaks
