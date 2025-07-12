# ESLint and Prettier Guide

This guide covers our code quality tools (ESLint and Prettier) for the Better Call Buffet project.

## ESLint

ESLint checks your code for potential errors and enforces our coding standards.

### Setup

ESLint is already configured in the project with the following plugins:

- TypeScript ESLint for TypeScript support
- React and React Hooks plugins for React best practices
- Prettier integration to avoid conflicts

### Running ESLint

```bash
# Check for issues
yarn lint

# Fix automatically fixable issues
yarn lint:fix
```

### Configuration

Our ESLint configuration (`.eslintrc.js`) includes:

- TypeScript-specific rules
- React best practices
- Disabled rules that conflict with Prettier
- Custom rules aligned with our project needs

Key rules include:

- No unused variables (with ignore patterns for variables starting with `_`)
- Warning on `any` type usage
- No console statements (except warnings and errors)
- React 17+ mode (no React import needed)
- TypeScript strict mode integration

### VS Code Integration

If you're using VS Code, install the ESLint extension and add to your `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

## Prettier

Prettier automatically formats your code to maintain a consistent style across the project.

### Setup

Prettier is configured with our preferred styling options in `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Running Prettier

```bash
# Check for formatting issues
yarn format:check

# Fix formatting issues
yarn format
```

### VS Code Integration

Install the Prettier extension for VS Code and add to your `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Handling Conflicts

ESLint and Prettier are configured to work together through `eslint-config-prettier` and `eslint-plugin-prettier`. If you encounter conflicts:

1. Run `yarn lint:fix` first
2. Then run `yarn format`
3. If issues persist, check for rule conflicts in `.eslintrc.js`

## Pre-commit Checks

For a better workflow, consider setting up Husky and lint-staged to run these checks before committing:

```bash
# Install husky and lint-staged
yarn add -D husky lint-staged

# Setup husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Then add to your `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": "prettier --write"
  }
}
```

## Troubleshooting

### Common ESLint Errors

- **"React must be in scope"**: Make sure `.eslintrc.js` has `'react/react-in-jsx-scope': 'off'`
- **Type errors**: Ensure TypeScript types are properly defined
- **Import errors**: Check path alias configuration

### Common Prettier Issues

- **Formatting not applied on save**: Check VS Code settings
- **Conflicts with ESLint**: Ensure `eslint-config-prettier` is in the extends array
- **Inconsistent formatting**: Run `yarn format` on the entire project

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [ESLint TypeScript Plugin](https://github.com/typescript-eslint/typescript-eslint)
- [ESLint React Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
