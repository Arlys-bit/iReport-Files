export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const catchAsyncError = (fn: Function) => {
  return (...args: any[]) => Promise.resolve(fn(...args)).catch(args[2]);
};
