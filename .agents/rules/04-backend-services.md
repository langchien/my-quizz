# Backend Services & Repository Pattern

## Repository Pattern
Mỗi domain có **interface** trong `repositories/types/` hoặc `services/`, implementation Firebase trong `repositories/firebase/`:

```typescript
// repositories/types/quiz.repository.ts
export interface QuizRepository {
  listByTeacher(teacherId: string): Promise<Quiz[]>;
  getById(id: string): Promise<Quiz | null>;
  create(dto: CreateQuizDto): Promise<Quiz>;
  update(id: string, dto: UpdateQuizDto): Promise<Quiz>;
  delete(id: string): Promise<void>;
}
```

Sau này thêm `repositories/nest/quiz.repository.ts` implement cùng interface — **không đổi hooks/components**.

## Types & DTO (align NestJS)
- Domain types (`Quiz`, `Question`, `Room`) trong `src/types/` — không phụ thuộc Firestore field names.
- DTO suffix `Dto`: `CreateQuizDto`, `JoinRoomDto`, `SubmitAnswerDto`.
- Mapper: `toQuiz()` / `toFirestore()` trong `repositories/firebase/mappers/`.
- ID dùng `string` (UUID/cuid) — tương thích SQL primary key sau này.

## Auth Abstraction
Không gọi `signInWithEmailAndPassword` trong component. Dùng `authService` + `useAuth()`:

```typescript
interface AuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(cb: (user: User | null) => void): Unsubscribe;
}
```

Domain `User` dùng `id` — không expose Firebase `User` type ra ngoài service layer.

## Real-time (Live Room)
- Hook `useLiveRoom(roomCode)`: `{ room, participants, submitAnswer, isConnected }`.
- Firestore `onSnapshot` **chỉ** trong repository/hook adapter.
- Contract event map sang Socket.io sau: `room:player-joined`, `room:submit-answer`, `room:question-result`.

## Business Logic
- Tính điểm, validate đáp án, ownership → `services/`, không rải trong component.
- Domain errors: `QuizNotFoundError`, `RoomClosedError` — shape `{ code, message }` tương thích Nest sau này.
