---
description: Quy trình thêm feature
---

# Workflow and Conventions

## Quy trình thêm feature

Tuân thủ bắt buộc 5 bước sau, không skip bước 1-2 dù MVP gấp:

1. Định nghĩa type + DTO.
2. Viết interface repository/service.
3. Implement Firebase adapter.
4. Hook mỏng → component.

## Quy ước code chung

- TypeScript cho mọi file mới.
- Functional components + hooks.
- Comment chỉ khi logic không hiển nhiên.
- Không over-engineer; diff tối thiểu, đúng scope task.
