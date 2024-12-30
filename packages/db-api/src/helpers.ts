import { Response } from 'express';

export const handle500Response = (
  res: Response,
  error: unknown,
  message: string,
  source: string,
  requestBody?: string,
) => {
  console.error(`Error in ${source}:`, message, '- Request Body:', requestBody);
  console.error(error);
  return res.status(500).json({ message });
};
