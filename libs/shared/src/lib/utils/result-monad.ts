export const ok = <T = void>(value?: T): { ok: true; value: T } => ({
  ok: true,
  value: value || (undefined as any as T),
});

export const err = <E extends ResultError = ResultError>(error: E): { ok: false; error: E } => ({ ok: false, error });

export type Result<T = void, E = ResultError> = { ok: true; value: T } | { ok: false; error: E };

export class ResultError extends Error {
  // Cannot have an as const name property here because of child classes
  // would be incompatible
  override name = 'ResultError';

  constructor(message: string, stack?: string) {
    super(message);
    if (stack) this.stack = stack;
  }

  serialise() {
    return {
      name: this.name,
      stack: this.stack,
      message: this.message,
    };
  }
}

// NOTE: Class name _MUST_ equal the name property of the class

export class BadRequest extends ResultError {
  // Must have as const so duck-typing doesn't allow invalid sum types
  // const x: Conflict | Unexpected = new BadRequest('adasd');
  override name = 'BadRequest' as const;
  constructor(message: string) {
    super(message);
  }
}

export const badRequest = (message: string) => new BadRequest(message);

/**
 * Type guard for checking if something is an error of any kind
 */
export const isError = (err: unknown): err is Error => err instanceof Error;

/**
 * Checks if the error is a ResultError<T>
 */
export const isResultError = <E>(err: unknown): err is ResultError =>
  err ? ResultError.prototype.isPrototypeOf(err as E) == true : false;
