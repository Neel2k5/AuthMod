export interface ResponseDTO<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
  }
  