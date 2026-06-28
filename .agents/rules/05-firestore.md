# Firestore Guidelines

## Firestore (Tạm thời, cô lập)
Vì project sẽ migrate sang NestJS, logic của database cần được xử lý cẩn thận:
- Mirror Security Rules logic trong service (check owner trước khi ghi) — `// TODO: server-side in Nest`.
- Không leak `correctAnswer` xuống client học sinh — filter trong mapper khi role !== host.
- Việc thao tác với db luôn phải giới hạn trong repository Firebase, không bao giờ để rò rỉ ra UI.
