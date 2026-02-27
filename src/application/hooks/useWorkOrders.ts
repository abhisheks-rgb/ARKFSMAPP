// /**
//  * useWorkOrders.ts
//  * ─────────────────────────────────────────────────────────────
//  * React Query hooks for Work Orders.
//  *
//  * Install:  npm install @tanstack/react-query
//  *
//  * These hooks give you:
//  *   • Automatic caching & background refetch
//  *   • Loading / error states out of the box
//  *   • Optimistic updates on mutations
//  *   • Cache invalidation after writes
//  *
//  * Usage in a component:
//  *   const { data, isLoading } = useWorkOrders({ status: 'pending' });
//  *   const { mutate: assign }  = useAssignWorkOrder();
//  *   assign({ workOrderId: '123', engineerId: '456' });
//  */

// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   UseQueryResult,
//   UseMutationResult,
//   keepPreviousData,
// } from '@tanstack/react-query';
// import {
//   workOrderRepository,
//   WorkOrderDTO,
//   WorkOrderListParams,
//   CreateWorkOrderRequest,
//   AssignWorkOrderRequest,
//   UpdateStatusRequest,
//   DigitalFormSubmission,
// } from '../../infrastructure/repositories/WorkOrderRepository';
// import { PaginatedResponse } from '../../infrastructure/repositories/BaseRepository';
// import { AppError } from '../../domain/errors/AppError';

// // ─── Query Keys ───────────────────────────────────────────────────────────────
// // Centralising keys prevents typos and makes cache invalidation explicit.

// export const workOrderKeys = {
//   all:     ['work-orders'] as const,
//   lists:   () => [...workOrderKeys.all, 'list'] as const,
//   list:    (params: WorkOrderListParams) => [...workOrderKeys.lists(), params] as const,
//   details: () => [...workOrderKeys.all, 'detail'] as const,
//   detail:  (id: string) => [...workOrderKeys.details(), id] as const,
//   history: (id: string) => [...workOrderKeys.all, 'history', id] as const,
// };

// // ─── List ─────────────────────────────────────────────────────────────────────

// export function useWorkOrders(
//   params: WorkOrderListParams = {},
// ): UseQueryResult<PaginatedResponse<WorkOrderDTO>, AppError> {
//   return useQuery({
//     queryKey: workOrderKeys.list(params),
//     queryFn: async () => {
//       const result = await workOrderRepository.getWorkOrders(params);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     placeholderData: keepPreviousData, // smooth pagination UX
//     staleTime: 30_000, // 30s before background refetch
//   });
// }

// // ─── Detail ───────────────────────────────────────────────────────────────────

// export function useWorkOrder(
//   id: string,
// ): UseQueryResult<WorkOrderDTO, AppError> {
//   return useQuery({
//     queryKey: workOrderKeys.detail(id),
//     queryFn: async () => {
//       const result = await workOrderRepository.getWorkOrder(id);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     enabled: Boolean(id),
//   });
// }

// // ─── History ──────────────────────────────────────────────────────────────────

// export function useWorkOrderHistory(id: string) {
//   return useQuery({
//     queryKey: workOrderKeys.history(id),
//     queryFn: async () => {
//       const result = await workOrderRepository.getHistory(id);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     enabled: Boolean(id),
//   });
// }

// // ─── Create ───────────────────────────────────────────────────────────────────

// export function useCreateWorkOrder(): UseMutationResult<
//   WorkOrderDTO, AppError, CreateWorkOrderRequest
// > {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (payload: CreateWorkOrderRequest) => {
//       const result = await workOrderRepository.createWorkOrder(payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: () => {
//       // Invalidate all list queries so the new item appears
//       queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
//     },
//   });
// }

// // ─── Assign ───────────────────────────────────────────────────────────────────

// export function useAssignWorkOrder(): UseMutationResult<
//   WorkOrderDTO, AppError, { workOrderId: string } & AssignWorkOrderRequest
// > {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ workOrderId, ...payload }) => {
//       const result = await workOrderRepository.assignWorkOrder(workOrderId, payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: (updated) => {
//       // Update the cached detail immediately
//       queryClient.setQueryData(workOrderKeys.detail(updated.id), updated);
//       queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
//     },
//   });
// }

// // ─── Status update (punch in/out, before/after service) ──────────────────────

// export function useUpdateWorkOrderStatus(): UseMutationResult<
//   WorkOrderDTO, AppError, { workOrderId: string } & UpdateStatusRequest
// > {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ workOrderId, ...payload }) => {
//       const result = await workOrderRepository.updateStatus(workOrderId, payload);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: (updated) => {
//       queryClient.setQueryData(workOrderKeys.detail(updated.id), updated);
//       queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
//     },
//   });
// }

// // ─── Complete with digital form ───────────────────────────────────────────────

// export function useCompleteWorkOrder(): UseMutationResult<
//   WorkOrderDTO, AppError, { workOrderId: string; form: DigitalFormSubmission }
// > {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ workOrderId, form }) => {
//       const result = await workOrderRepository.completeWorkOrder(workOrderId, form);
//       if (result.isFailure) throw result.getError();
//       return result.getValue();
//     },
//     onSuccess: (completed) => {
//       queryClient.setQueryData(workOrderKeys.detail(completed.id), completed);
//       queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
//     },
//   });
// }

// // ─── Delete ───────────────────────────────────────────────────────────────────

// export function useDeleteWorkOrder(): UseMutationResult<void, AppError, string> {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (id: string) => {
//       const result = await workOrderRepository.deleteWorkOrder(id);
//       if (result.isFailure) throw result.getError();
//     },
//     onSuccess: (_, deletedId) => {
//       queryClient.removeQueries({ queryKey: workOrderKeys.detail(deletedId) });
//       queryClient.invalidateQueries({ queryKey: workOrderKeys.lists() });
//     },
//   });
// }