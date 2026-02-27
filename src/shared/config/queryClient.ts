// /**
//  * queryClient.ts
//  * ─────────────────────────────────────────────────────────────
//  * Shared React Query client with sensible FSM defaults.
//  *
//  * Wrap your app root:
//  *   import { queryClient } from './shared/config/queryClient';
//  *   import { QueryClientProvider } from '@tanstack/react-query';
//  *
//  *   <QueryClientProvider client={queryClient}>
//  *     <App />
//  *   </QueryClientProvider>
//  */

// import { QueryClient } from '@tanstack/react-query';
// import { AppError, ErrorCode } from '../../domain/errors/AppError';

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       // Don't retry on auth or validation errors — they won't self-heal
//       retry: (failureCount, error) => {
//         if (error instanceof AppError) {
//           if (
//             error.code === ErrorCode.UNAUTHORIZED ||
//             error.code === ErrorCode.VALIDATION_ERROR ||
//             error.code === ErrorCode.NOT_FOUND
//           ) return false;
//         }
//         return failureCount < 2;
//       },
//       staleTime: 30_000,      // 30s default
//       gcTime: 5 * 60_000,     // 5 min garbage collection
//       refetchOnWindowFocus: false, // mobile app — no window focus events
//     },
//     mutations: {
//       retry: false,
//     },
//   },
// });