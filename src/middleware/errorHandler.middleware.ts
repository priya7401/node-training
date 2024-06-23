import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../config/httpStatusCodes';
import { messages } from '../config/messages';
import { QueryFailedError } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const errorHanlder = async (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log('error handler');
  console.log(error);

  if (error && error.error && error.error.isJoi) {
    // Joi validation error
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      type: 'Validation Error',
      message: error.error.details.map((detail: { message: string }) => detail.message.replace(/"/g, '')).join(', '),
    });
  } else if (error instanceof QueryFailedError) {
    const pgError = error.driverError;

    let errorMessage: string = 'Database error';
    let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

    switch (pgError.code) {
      case '23505':
        // Unique violation - Duplicate key value violates unique constraint
        errorMessage = `${extractColumn(pgError.detail)} already exists in DB`;
        statusCode = HttpStatusCode.CONFLICT;
        break;
      case '23503':
        // Foreign key violation
        errorMessage = `${extractColumn(pgError.detail)} Foreign key violation`;
        statusCode = HttpStatusCode.CONFLICT;
        break;
      case '23502':
        // Not null violation - Null value violates not-null constraint
        errorMessage = `${extractColumn(pgError.detail)} cannot be null`;
        statusCode = HttpStatusCode.BAD_REQUEST;
        break;
      default:
        errorMessage = `Database error : ${pgError.message}`;
        statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    }

    return res.status(statusCode).json({ type: 'Postgresql error', message: errorMessage });
  }

  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(messages.internalServerError);
};

function extractColumn(detail: string | undefined) {
  if (!detail) return '';

  const columnMatch = detail.match(/Key \((.*?)\)=/);
  if (columnMatch && columnMatch.length > 1) {
    return columnMatch[1];
  }

  return '';
}
