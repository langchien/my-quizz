# React Layer — UI Only

Áp dụng cho `src/routes/`, `src/components/`, `src/pages/`, `src/**/*.tsx`.

- **Cấm** import từ `firebase/*`, `lib/firebase`, `repositories/firebase/*`.
- **Chỉ** dùng custom hooks (`useQuiz`, `useLiveRoom`, `useAuth`) và `types/`.
- Loader/action React Router gọi **service**, không gọi Firestore:

```typescript
// ✅ loader
export async function quizLoader({ params }: LoaderFunctionArgs) {
  return quizService.getById(params.quizId!);
}

// ❌ loader
export async function quizLoader({ params }: LoaderFunctionArgs) {
  return getDoc(doc(db, "quizzes", params.quizId!));
}
```

- Form submit → `action` hoặc handler gọi `service.create()` / `service.update()`, không `setDoc` trực tiếp.
