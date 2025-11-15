# Contributing Guide

Thank you for your interest in contributing to the Multilingual Support System!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/multilingual-support-system.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Component Structure

```tsx
// 1. Imports
import { useState } from "react";

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export function ComponentName({ prop }: Props) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Functions
  const handleAction = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Commit Messages

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add voice chat support
fix: resolve socket connection timeout
docs: update API documentation
```

### Testing

Before submitting:

1. Test all affected features
2. Check for console errors
3. Verify responsive design
4. Test in multiple browsers
5. Ensure no TypeScript errors

### Pull Request Process

1. Update README.md if needed
2. Update documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Feature Requests

Open an issue with:
- Clear description
- Use case
- Expected behavior
- Mockups (if applicable)

## Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots
- Environment details

## Questions?

Open a discussion or reach out to maintainers.

Thank you for contributing! 🎉
