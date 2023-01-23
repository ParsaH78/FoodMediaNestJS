/* eslint-disable prettier/prettier */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
  } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
  import { Request, Response } from 'express';
  
  @Catch()
  export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        method: request.method,
        path: request.url,
        message: `This ${exception.meta.target[0]} has already been registered !`
      });
    }
  }
  