/**
 * Result.ts
 * Functional result type — forces callers to handle both success and failure.
 * No more try/catch waterfalls in the UI layer.
 */
import { AppError } from './AppError';

export class Result<T, E = AppError> {
  readonly isSuccess: boolean;
  readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(ok: boolean, value?: T, error?: E) {
    this.isSuccess = ok;
    this.isFailure = !ok;
    this._value = value;
    this._error = error;
  }

  static ok<T, E = AppError>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static fail<T, E = AppError>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  getValue(): T {
    if (!this.isSuccess) throw new Error('Cannot get value of a failed Result');
    return this._value as T;
  }

  getError(): E {
    if (this.isSuccess) throw new Error('Cannot get error of a successful Result');
    return this._error as E;
  }

  /**
   * Transform the success value without unwrapping.
   * Result.ok(5).map(n => n * 2) → Result.ok(10)
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isFailure) return Result.fail<U, E>(this._error as E);
    return Result.ok<U, E>(fn(this._value as T));
  }

  /**
   * Chain Results — use when the mapping fn itself returns a Result.
   */
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isFailure) return Result.fail<U, E>(this._error as E);
    return fn(this._value as T);
  }

  /**
   * Convenience: fold both branches into a single value.
   */
  fold<U>(onSuccess: (value: T) => U, onFailure: (error: E) => U): U {
    return this.isSuccess
      ? onSuccess(this._value as T)
      : onFailure(this._error as E);
  }
}