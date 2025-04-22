# Test-210425
Requirement
Code Ul như design và logic thoả mãn các điều kiện sau:

Unit
- Gồm 2 giá trị là: % và px
- Default value: %

Value stepper
- Cho phép nhập các giá trị integer và float
- Nếu input chứa dấu phẩy → Thay thế thành dấu chấm
  - 12,3 → 12.3
- Nếu input chứa các kí tự khác giá trị số phù hợp → tự động loại bỏ các giá trị:
  - 123a → 123
  - 12a3 → 12
  - a123 → Nhận giá trị đúng gần nhất
- User nhập < 0 và out focus sẽ tự động nhảy về 0
- Nếu Unit là %:
  - User nhập > 100 và out focus sẽ tự động nhảy về giá trị hợp lệ trước khi nhập
  - Nếu giá trị trong ô input hiện tại là O → Disable button "-"
  - Nếu giá trị trong ô input hiện tại là 100 → Disable button "+"
- Nếu switch từ px sang % và giá trị hiện tại lớn hơn 100 → Update về 100

![ui](https://res.cloudinary.com/ngoviettung154/image/upload/v1745316175/_demo/images/fe120326-6cda-4f3b-9c63-553371bea70d.png)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
