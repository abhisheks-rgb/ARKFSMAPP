// /**
//  * WorkOrderRepository.ts
//  * All work order API calls: CRUD, assignment, status transitions,
//  * digital form submission, history, and file upload.
//  */

// import { BaseRepository } from './BaseRepository';
// import { API_CONFIG } from '../../shared/config/ApiConfig';
// import { Result } from '../../domain/errors/Result';
// import { AppError } from '../../domain/errors/AppError';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type TaskType     = 'delivery' | 'collection' | 'remote_support';
// export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
// export type TaskStatus   =
//   | 'pending'
//   | 'assigned'
//   | 'checked_in'
//   | 'before_service'
//   | 'after_service'
//   | 'checked_out'
//   | 'completed'
//   | 'delayed'
//   | 'cancelled';

// export interface WorkOrderDTO {
//   id: string;
//   client_id: string;
//   client_name: string;
//   engineer_id: string | null;
//   engineer_name: string | null;
//   task_type: TaskType;
//   description: string;
//   priority: TaskPriority;
//   status: TaskStatus;
//   due_date: string;        // ISO 8601
//   created_at: string;
//   updated_at: string;
//   location: {
//     address: string;
//     latitude: number;
//     longitude: number;
//   };
// }

// export interface CreateWorkOrderRequest {
//   client_id: string;
//   task_type: TaskType;
//   description: string;
//   priority: TaskPriority;
//   due_date: string;
//   location: {
//     address: string;
//     latitude?: number;
//     longitude?: number;
//   };
// }

// export interface AssignWorkOrderRequest {
//   engineer_id: string;
//   helper_engineer_ids?: string[];
// }

// export interface UpdateStatusRequest {
//   status: TaskStatus;
//   latitude?: number;
//   longitude?: number;
//   notes?: string;
// }

// export interface DigitalFormSubmission {
//   work_order_id: string;
//   customer_name: string;
//   technician_name: string;
//   actions_performed: string;
//   time_spent_minutes: number;
//   equipment_details: string;
//   parts_used: string;
//   observations: string;
//   customer_signature_base64: string; // on-screen Android signature
// }

// export interface WorkOrderListParams extends Record<string, unknown> {
//   page?: number;
//   per_page?: number;
//   status?: TaskStatus;
//   priority?: TaskPriority;
//   engineer_id?: string;
//   client_id?: string;
//   due_date_from?: string;
//   due_date_to?: string;
//   search?: string;
// }

// // ─── Repository ───────────────────────────────────────────────────────────────

// export class WorkOrderRepository extends BaseRepository<WorkOrderDTO> {
//   constructor() {
//     super(API_CONFIG.ENDPOINTS.WORK_ORDERS.LIST);
//   }

//   // Override list with work-order-specific filter params
//   async getWorkOrders(params?: WorkOrderListParams) {
//     return this.list(params);
//   }

//   async getWorkOrder(id: string) {
//     return this.getById(id);
//   }

//   async createWorkOrder(payload: CreateWorkOrderRequest) {
//     return this.create(payload);
//   }

//   async updateWorkOrder(id: string, payload: Partial<CreateWorkOrderRequest>) {
//     return this.patch(id, payload);
//   }

//   async deleteWorkOrder(id: string) {
//     return this.delete(id);
//   }

//   // ── Assignment ────────────────────────────────────────────────────────────
//   async assignWorkOrder(
//     id: string,
//     payload: AssignWorkOrderRequest,
//   ): Promise<Result<WorkOrderDTO, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.WORK_ORDERS.ASSIGN(id), payload);
//   }

//   // ── Status transitions (punch in/out, before/after service) ──────────────
//   async updateStatus(
//     id: string,
//     payload: UpdateStatusRequest,
//   ): Promise<Result<WorkOrderDTO, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.WORK_ORDERS.STATUS_UPDATE(id), payload);
//   }

//   // ── Complete with digital form ────────────────────────────────────────────
//   async completeWorkOrder(
//     id: string,
//     form: DigitalFormSubmission,
//   ): Promise<Result<WorkOrderDTO, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.WORK_ORDERS.COMPLETE(id), form);
//   }

//   // ── History / audit trail ─────────────────────────────────────────────────
//   async getHistory(id: string): Promise<Result<WorkOrderHistoryEntry[], AppError>> {
//     return this.get(API_CONFIG.ENDPOINTS.WORK_ORDERS.HISTORY(id));
//   }

//   // ── Upload attachment (photo evidence, etc.) ──────────────────────────────
//   async uploadAttachment(
//     id: string,
//     file: { uri: string; name: string; type: string },
//   ): Promise<Result<{ url: string }, AppError>> {
//     return this.safeCall(async () => {
//       const formData = new FormData();
//       formData.append('file', file as any);

//       const { data } = await this.client.post<{ url: string }>(
//         `${API_CONFIG.ENDPOINTS.WORK_ORDERS.DETAIL(id)}/attachments`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } },
//       );
//       return data;
//     });
//   }
// }

// // ─── Types (continued) ────────────────────────────────────────────────────────

// export interface WorkOrderHistoryEntry {
//   id: string;
//   action: string;
//   performed_by: string;
//   performed_at: string;
//   changes: Record<string, { from: unknown; to: unknown }>;
// }

// export const workOrderRepository = new WorkOrderRepository();