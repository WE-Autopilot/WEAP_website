# WEAP Website Client

This is the client-side code for the WEAP Website, built with modern React and TypeScript.

## Architecture

The codebase follows a component-based architecture with the following structure:

```
client/
├── public/        # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── common/         # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Form/
│   │   │   ├── FormField/
│   │   │   ├── Spinner/
│   │   │   └── ...
│   │   ├── __tests__/      # Component tests
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── __tests__/      # Hook tests
│   │   ├── useApi.ts
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   └── index.tsx           # Application entry point
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Features

- **TypeScript**: Fully typed codebase for better developer experience and code quality
- **Component Library**: Reusable UI components in the `common` directory
- **Custom Hooks**: Shared logic encapsulated in custom hooks
- **Form Handling**: Robust form components with validation
- **Testing**: Jest and React Testing Library for unit and integration tests
- **Responsive Design**: Mobile-friendly UI
- **Accessibility**: WCAG-compliant components
- **Error Handling**: Global error boundary and consistent error handling patterns

## Development Guidelines

### Component Structure

1. Organize components in separate directories with related files:
   ```
   Button/
   ├── Button.tsx
   ├── Button.css
   └── index.ts
   ```

2. Use TypeScript interfaces for props:
   ```typescript
   interface ButtonProps {
     variant?: 'primary' | 'secondary' | 'text';
     size?: 'small' | 'medium' | 'large';
     children: React.ReactNode;
     onClick?: () => void;
     disabled?: boolean;
   }
   ```

3. Implement proper accessibility attributes:
   ```tsx
   <button
     type="button"
     className={`btn btn-${variant} btn-${size}`}
     onClick={onClick}
     disabled={disabled}
     aria-disabled={disabled}
   >
     {children}
   </button>
   ```

### Form Validation

We use Zod for schema validation:

```typescript
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;
```

### Testing

Write tests for all components and hooks:

```typescript
describe('Button Component', () => {
  test('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
    expect(button).toHaveClass('btn-medium');
  });
});
```

### Error Handling

Use the ErrorBoundary for component-level errors and try/catch for async operations:

```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  if (error instanceof ApiError) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred');
  }
} finally {
  setLoading(false);
}
```

## Continuous Improvement

The codebase is continuously being improved with:

1. Migration from JavaScript to TypeScript
2. Addition of comprehensive tests
3. Improved component structure and reusability
4. Enhanced accessibility
5. Better error handling
6. Performance optimizations

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Run tests:
   ```
   npm test
   ```

4. Build for production:
   ```
   npm run build
   ```
