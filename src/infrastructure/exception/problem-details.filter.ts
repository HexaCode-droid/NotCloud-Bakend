import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import type { Request, Response } from "express";
import { ExisteUserException } from "../../application/exception/ExisteUserException";
import { InvalidCredentialsException } from "../../application/exception/InvalidCredentialsException";
import { TokenExpired } from "../../application/exception/TokenExpired";
import { ProblemDetailsBuilder } from "./problem-details.builder";
import { PROBLEM_CONTENT_TYPE } from "./problem-details.types";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
    private readonly builder = new ProblemDetailsBuilder(
        process.env.PROBLEM_DETAILS_BASE_URL ?? "https://notcloud.local/problems",
    );

    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const request = host.switchToHttp().getRequest<Request>();
        const instance = request.originalUrl ?? request.url;

        const problem = this.toProblemDetails(exception, instance);

        response.status(problem.status).type(PROBLEM_CONTENT_TYPE).json(problem);
    }

    private toProblemDetails(exception: unknown, instance: string) {
        if (exception instanceof ExisteUserException) {
            return this.builder.conflict(exception.message, instance);
        }

        if (exception instanceof InvalidCredentialsException) {
            return this.builder.unauthorized(exception.message, instance, "invalid-credentials");
        }

        if (exception instanceof TokenExpired) {
            return this.builder.unauthorized(exception.message, instance, "token-expired");
        }

        if (exception instanceof HttpException) {
            return this.fromHttpException(exception, instance);
        }

        if (exception instanceof Error) {
            return this.builder.internalError(exception.message, instance);
        }

        return this.builder.internalError("Ha ocurrido un error inesperado", instance);
    }

    private fromHttpException(exception: HttpException, instance: string) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === "string") {
            return this.builder.fromHttpStatus(status, exceptionResponse, instance);
        }

        const body = exceptionResponse as {
            message?: string | string[];
            error?: string;
        };
        const message = body.message;

        if (Array.isArray(message)) {
            return this.builder.badRequest(
                "Error de validación en los datos enviados",
                instance,
                message,
            );
        }

        const detailMessage = typeof message === "string" ? message : exception.message;

        return this.builder.fromHttpStatus(status, detailMessage, instance);
    }
}
