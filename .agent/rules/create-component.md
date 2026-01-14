---
trigger: always_on
---

# Component Creation Rules

1. **Structure**:
   - Tạo thư mục trùng tên component (nếu component phức tạp).
   - File chính: `index.tsx` hoặc `TênComponent.tsx`.
   - File test (nếu có): `TênComponent.test.tsx`.

2. **Syntax Requirements**:
   - Sử dụng **Named Export** thay vì Default Export (để dễ refactor và autocomplete).
   - Sử dụng **Functional Components** với Hooks.
   - Định nghĩa `Props` bằng `interface`.

3. **Code Template**:
   Khi tạo component mới, hãy tuân theo mẫu sau:

   ```tsx
   import React from 'react'
   // import styles hoặc clsx/tailwind

   interface ComponentNameProps {
     // Định nghĩa props rõ ràng
     title: string
     isActive?: boolean
   }

   export const ComponentName: React.FC<ComponentNameProps> = ({ title, isActive = false }) => {
     // Logic hooks ở đây (recommend tách ra custom hook nếu quá dài)

     return <div className={/* styles */}>{/* JSX content */}</div>
   }
   ```
