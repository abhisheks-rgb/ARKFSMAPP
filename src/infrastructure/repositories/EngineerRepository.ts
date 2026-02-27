// /**
//  * EngineerRepository.ts
//  * Engineer-specific calls: availability, punch in/out, GPS location updates.
//  */

// import { BaseRepository } from './BaseRepository';
// import { API_CONFIG } from '../../shared/config/ApiConfig';
// import { Result } from '../../domain/errors/Result';
// import { AppError } from '../../domain/errors/AppError';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type EngineerLevel        = 'L1' | 'L2' | 'L3';
// export type EngineerAvailability = 'available' | 'busy' | 'on_leave';

// export interface EngineerDTO {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   level: EngineerLevel;
//   availability: EngineerAvailability;
//   current_task_count: number;
//   max_tasks_per_day: number;     // default 4 per FSM SLA
//   current_location?: {
//     latitude: number;
//     longitude: number;
//     updated_at: string;
//   };
// }

// export interface PunchInRequest {
//   work_order_id: string;
//   latitude: number;
//   longitude: number;
//   timestamp: string; // ISO 8601
// }

// export interface PunchOutRequest extends PunchInRequest {
//   notes?: string;
// }

// export interface PunchCorrectionRequest {
//   work_order_id: string;
//   correction_type: 'punch_in' | 'punch_out';
//   correct_timestamp: string;
//   reason: string;
// }

// export interface LocationUpdateRequest {
//   latitude: number;
//   longitude: number;
// }

// // ─── Repository ───────────────────────────────────────────────────────────────

// export class EngineerRepository extends BaseRepository<EngineerDTO> {
//   constructor() {
//     super(API_CONFIG.ENDPOINTS.ENGINEERS.LIST);
//   }

//   async getEngineers(params?: { level?: EngineerLevel; availability?: EngineerAvailability }) {
//     return this.list(params);
//   }

//   async getEngineer(id: string) {
//     return this.getById(id);
//   }

//   async getAvailability(id: string): Promise<Result<EngineerAvailability, AppError>> {
//     return this.get(API_CONFIG.ENDPOINTS.ENGINEERS.AVAILABILITY(id));
//   }

//   // ── Punch in ──────────────────────────────────────────────────────────────
//   async punchIn(
//     engineerId: string,
//     payload: PunchInRequest,
//   ): Promise<Result<{ punched_in_at: string }, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.ENGINEERS.PUNCH_IN(engineerId), payload);
//   }

//   // ── Punch out ─────────────────────────────────────────────────────────────
//   async punchOut(
//     engineerId: string,
//     payload: PunchOutRequest,
//   ): Promise<Result<{ punched_out_at: string; duration_minutes: number }, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.ENGINEERS.PUNCH_OUT(engineerId), payload);
//   }

//   // ── Request punch correction (goes to admin for approval) ─────────────────
//   async requestPunchCorrection(
//     engineerId: string,
//     payload: PunchCorrectionRequest,
//   ): Promise<Result<{ correction_id: string }, AppError>> {
//     return this.post(
//       `${API_CONFIG.ENDPOINTS.ENGINEERS.DETAIL(engineerId)}/punch-corrections`,
//       payload,
//     );
//   }

//   // ── Update GPS location (called periodically while on task) ───────────────
//   async updateLocation(
//     engineerId: string,
//     payload: LocationUpdateRequest,
//   ): Promise<Result<void, AppError>> {
//     return this.post(API_CONFIG.ENDPOINTS.ENGINEERS.LOCATION(engineerId), payload);
//   }

//   // ── Get engineer's task list ───────────────────────────────────────────────
//   async getEngineerTasks(engineerId: string) {
//     return this.get(API_CONFIG.ENDPOINTS.ENGINEERS.TASKS(engineerId));
//   }
// }

// export const engineerRepository = new EngineerRepository();