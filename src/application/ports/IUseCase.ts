/**
 * IUseCase — every use case implements this.
 * path: src/application/ports/IUseCase.ts
 */
export interface IUseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}