// /**
//  * useEngineers.ts
//  * React Query hooks for engineer operations:
//  * availability, punch in/out, location updates.
//  */

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   engineerRepository,
//   EngineerDTO,
//   EngineerLevel,
//   EngineerAvailability,
//   PunchInRequest,
//   PunchOutRequest,
//   PunchCorrectionRequest,
//   LocationUpdateRequest,
// } from '../../infrastructure/repositories/EngineerRepository';
// import { AppError } from '../../domain/errors/AppError';

// // ─── Query Keys ───────────────────────────────────────────────────────────────

// export const engineerKeys = {
//   all:          ['engineers'] as const,
//   lists:        () => [...engineerKeys.all, 'list'] as const,
//   list:         (params: object) => [...engineerKeys.lists(), params] as const,
//   details:      () => [...engineerKeys.all, 'detail'] as const,
//   detail:       (id: string) => [...engineerKeys.details(), id] as const,
//   availability: (id: string) => [...engineerKeys.all, 'availability', id] as const,
//   tasks:        (id: string) => [...engineerKeys.all, 'tasks', id] as const,
// };

// // ─── List engineers ───────────────────────────────────────────────────────────

// export function useEngineers(params?: {
//   level?: EngineerLevel;
//   availability?: EngineerAvailability;
// }) {
//   return useQuery({
//     queryKey: engineerKeys.list(params ?? {}),
//     queryFn: async () => {
//       const result = await engineerRepository.getEngineers(params);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     staleTime: 60_000, // availability changes, but not every second
//   });
// }

// // ─── Single engineer ──────────────────────────────────────────────────────────

// export function useEngineer(id: string) {
//   return useQuery<EngineerDTO, AppError>({
//     queryKey: engineerKeys.detail(id),
//     queryFn: async () => {
//       const result = await engineerRepository.getEngineer(id);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     enabled: Boolean(id),
//   });
// }

// // ─── Punch in ─────────────────────────────────────────────────────────────────

// export function usePunchIn() {
//   const queryClient = useQueryClient();
//   return useMutation<
//     { punched_in_at: string },
//     AppError,
//     { engineerId: string } & PunchInRequest
//   >({
//     mutationFn: async ({ engineerId, ...payload }) => {
//       const result = await engineerRepository.punchIn(engineerId, payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: (_, { engineerId }) => {
//       queryClient.invalidateQueries({ queryKey: engineerKeys.detail(engineerId) });
//       queryClient.invalidateQueries({ queryKey: engineerKeys.tasks(engineerId) });
//     },
//   });
// }

// // ─── Punch out ────────────────────────────────────────────────────────────────

// export function usePunchOut() {
//   const queryClient = useQueryClient();
//   return useMutation<
//     { punched_out_at: string; duration_minutes: number },
//     AppError,
//     { engineerId: string } & PunchOutRequest
//   >({
//     mutationFn: async ({ engineerId, ...payload }) => {
//       const result = await engineerRepository.punchOut(engineerId, payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: (_, { engineerId }) => {
//       queryClient.invalidateQueries({ queryKey: engineerKeys.detail(engineerId) });
//       queryClient.invalidateQueries({ queryKey: engineerKeys.tasks(engineerId) });
//     },
//   });
// }

// // ─── Request punch correction ─────────────────────────────────────────────────

// export function useRequestPunchCorrection() {
//   return useMutation<
//     { correction_id: string },
//     AppError,
//     { engineerId: string } & PunchCorrectionRequest
//   >({
//     mutationFn: async ({ engineerId, ...payload }) => {
//       const result = await engineerRepository.requestPunchCorrection(engineerId, payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//   });
// }

// // ─── Location update (background GPS tracking) ────────────────────────────────

// export function useUpdateLocation() {
//   return useMutation<void, AppError, { engineerId: string } & LocationUpdateRequest>({
//     mutationFn: async ({ engineerId, ...payload }) => {
//       const result = await engineerRepository.updateLocation(engineerId, payload);
//       if (result.isFailure) throw result.getError();
//     },
//     // Silent mutation — no cache invalidation needed for location pings
//   });
// }

// // ─── Engineer task list ───────────────────────────────────────────────────────

// export function useEngineerTasks(engineerId: string) {
//   return useQuery({
//     queryKey: engineerKeys.tasks(engineerId),
//     queryFn: async () => {
//       const result = await engineerRepository.getEngineerTasks(engineerId);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     enabled: Boolean(engineerId),
//     refetchInterval: 60_000, // poll every 60s for new task assignments
//   });
// }