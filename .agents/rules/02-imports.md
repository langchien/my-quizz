# Import Rules

Quy tắc import là quan trọng nhất để đảm bảo khả năng migrate sang NestJS sau này.

| Layer                    | Được import                           | Cấm import                    |
| ------------------------ | ------------------------------------- | ----------------------------- |
| `routes/`, `components/` | `hooks/`, `types/`                    | `firebase/*`, `repositories/` |
| `hooks/`                 | `services/`, `types/`                 | `firebase/*`, `repositories/` |
| `services/`              | `repositories/` (interface), `types/` | `firebase/*`                  |
| `repositories/`          | `firebase/*`, `types/`, mappers       | —                             |

## Ví dụ
```typescript
// ❌ BAD — component gắn Firestore
const snap = await getDoc(doc(db, "quizzes", id));

// ✅ GOOD — component qua hook
const { quiz, isLoading } = useQuiz(quizId);
```

## Định dạng Import

Ưu tiên sử dụng tuyệt đối (absolute imports) thông qua alias `@/` thay vì đường dẫn tương đối để import các module nội bộ của dự án. 
Ví dụ: thay vì `../../components/Button`, hãy sử dụng `@/components/Button`. Điều này giúp tránh tình trạng "relative import hell" và dễ dàng refactor.
