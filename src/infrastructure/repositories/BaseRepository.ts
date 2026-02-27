// /**
//  * BaseRepository.ts
//  * ─────────────────────────────────────────────────────────────
//  * Generic CRUD wrapper around httpClient.
//  * All feature repositories extend this to get list/get/create/update/delete
//  * for free, and only override what's different.
//  *
//  * Usage:
//  *   class WorkOrderRepository extends BaseRepository<WorkOrderDTO> {
//  *     constructor() { super(API_CONFIG.ENDPOINTS.WORK_ORDERS.LIST); }
//  *   }
//  */

// import { AxiosInstance } from 'axios';
// import { httpClient } from '../network/HttpClient';
// import { Result } from '../../domain/errors/Result';
// import { AppError } from '../../domain/errors/AppError';

// // ─── Pagination ────────────────────────────────────────────────────────────

// export interface PaginationParams {
//   page?: number;
//   per_page?: number;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     current_page: number;
//     total_pages: number;
//     total_count: number;
//     per_page: number;
//   };
// }

// // ─── Base ─────────────────────────────────────────────────────────────────────

// export abstract class BaseRepository<T> {
//   protected readonly client: AxiosInstance = httpClient;

//   constructor(protected readonly basePath: string) {}

//   // ── List (paginated) ──────────────────────────────────────────────────────
//   async list(
//     params?: PaginationParams & Record<string, unknown>,
//   ): Promise<Result<PaginatedResponse<T>, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.get<PaginatedResponse<T>>(this.basePath, { params });
//       return data;
//     });
//   }

//   // ── Get single ────────────────────────────────────────────────────────────
//   async getById(id: string): Promise<Result<T, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.get<T>(`${this.basePath}/${id}`);
//       return data;
//     });
//   }

//   // ── Create ────────────────────────────────────────────────────────────────
//   async create<TInput>(payload: TInput): Promise<Result<T, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.post<T>(this.basePath, payload);
//       return data;
//     });
//   }

//   // ── Update (full) ─────────────────────────────────────────────────────────
//   async update<TInput>(id: string, payload: TInput): Promise<Result<T, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.put<T>(`${this.basePath}/${id}`, payload);
//       return data;
//     });
//   }

//   // ── Partial update ────────────────────────────────────────────────────────
//   async patch<TInput>(id: string, payload: TInput): Promise<Result<T, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.patch<T>(`${this.basePath}/${id}`, payload);
//       return data;
//     });
//   }

//   // ── Delete ────────────────────────────────────────────────────────────────
//   async delete(id: string): Promise<Result<void, AppError>> {
//     return this.safeCall(async () => {
//       await this.client.delete(`${this.basePath}/${id}`);
//     });
//   }

//   // ── Custom GET helper ─────────────────────────────────────────────────────
//   protected async get<TResponse>(
//     path: string,
//     params?: Record<string, unknown>,
//   ): Promise<Result<TResponse, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.get<TResponse>(path, { params });
//       return data;
//     });
//   }

//   // ── Custom POST helper ────────────────────────────────────────────────────
//   protected async post<TInput, TResponse>(
//     path: string,
//     payload?: TInput,
//   ): Promise<Result<TResponse, AppError>> {
//     return this.safeCall(async () => {
//       const { data } = await this.client.post<TResponse>(path, payload);
//       return data;
//     });
//   }

//   // ── Wraps any async call, catching AppErrors and unknown errors ───────────
//   protected async safeCall<TResponse>(
//     fn: () => Promise<TResponse>,
//   ): Promise<Result<TResponse, AppError>> {
//     try {
//       const result = await fn();
//       return Result.ok(result);
//     } catch (error) {
//       if (error instanceof AppError) return Result.fail(error);
//       return Result.fail(AppError.unknown(error));
//     }
//   }
// }