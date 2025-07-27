# Error Handling System

This folder contains utilities to improve error handling throughout the application without modifying existing code.

## Quick Start

To use the enhanced error handling, follow these steps:

1. **Initialize error handling by importing the setup file:**
   ```typescript
   // In main.tsx or App.tsx
   import './utils/setupErrorHandling';
   ```
   
   This will automatically set up toast notifications, global error handling, and React Query DevTools.

2. **Use the enhanced API client for new API calls:**
   ```typescript
   import { enhancedApi } from '../services/apiEnhanced';
   
   // Use like this
   const fetchData = async () => {
     try {
       const data = await enhancedApi.get('/endpoint');
       return data;
     } catch (error) {
       // Error is already handled, logged, and displayed to user
       return null;
     }
   };
   ```

3. **Use the error boundary for component error handling:**
   ```typescript
   import { ErrorBoundary } from 'react-error-boundary';
   import ErrorFallback from './components/common/ErrorFallback';
   
   // Wrap components that might error
   <ErrorBoundary FallbackComponent={ErrorFallback}>
     <YourComponent />
   </ErrorBoundary>
   ```

4. **Display errors to users:**
   ```typescript
   import { showErrorToast } from './utils/errorUtils';
   
   // Show an error message
   showErrorToast('Something went wrong');
   
   // Or with an error object
   showErrorToast(new Error('Failed to load data'));
   ```

## Utilities Available

### `errorUtils.ts`
- `showErrorToast(error)` - Displays a toast notification with an error message
- `logError(error, componentInfo)` - Logs errors to console and analytics
- `handleApiError(error)` - Converts API errors to a standardized format
- `fetchWithErrorHandling(url, options)` - Enhanced fetch with error handling

### `apiEnhanced.ts`
- `enhancedApi.get(endpoint)` - GET request with error handling
- `enhancedApi.post(endpoint, data)` - POST request with error handling
- `enhancedApi.put(endpoint, data)` - PUT request with error handling
- `enhancedApi.delete(endpoint)` - DELETE request with error handling

### `components/common/ErrorFallback.tsx`
- Error boundary fallback component for React components

## Benefits

This error handling system:

1. **Works alongside existing code** - No need to modify current code
2. **Provides consistent error reporting** - All errors follow the same format
3. **Improves user experience** - Friendly error messages via toast notifications
4. **Tracks errors in analytics** - All errors are logged for troubleshooting
5. **Prevents app crashes** - Error boundaries catch component errors
6. **Standardizes API errors** - All API errors follow the same structure

## Implementation Details

The error handling system is implemented through multiple files:

- `errorUtils.ts` - Core error handling utilities
- `errorInit.ts` - Global error handler initialization
- `setupErrorHandling.ts` - Auto-initializes error handling
- `apiEnhanced.ts` - API client with error handling
- `components/common/ErrorFallback.tsx` - Error boundary component 