class CustomAPIError extends Error {
  message: string;
  statusCode: number;
  constructor (message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}
const createCustomError = (msg: string, statusCode: number): CustomAPIError => {
  return new CustomAPIError(msg, statusCode);
};
export { createCustomError, CustomAPIError };
