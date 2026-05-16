import { HttpStatus } from "@nestjs/common";
import type { ProblemDetails } from "./problem-details.types";

export class ProblemDetailsBuilder {
    constructor(private readonly baseUrl: string) {}

    build(input: {
        type: string;
        title: string;
        status: number;
        detail?: string;
        instance?: string;
        errors?: string[];
    }): ProblemDetails {
        const problem: ProblemDetails = {
            type: `${this.baseUrl}/${input.type}`,
            title: input.title,
            status: input.status,
        };

        if (input.detail) {
            problem.detail = input.detail;
        }

        if (input.instance) {
            problem.instance = input.instance;
        }

        if (input.errors?.length) {
            problem.errors = input.errors;
        }

        return problem;
    }

    conflict(detail: string, instance?: string): ProblemDetails {
        return this.build({
            type: "conflict",
            title: "Conflict",
            status: HttpStatus.CONFLICT,
            detail,
            instance,
        });
    }

    unauthorized(detail: string, instance?: string, type = "unauthorized"): ProblemDetails {
        return this.build({
            type,
            title: "Unauthorized",
            status: HttpStatus.UNAUTHORIZED,
            detail,
            instance,
        });
    }

    badRequest(detail: string, instance?: string, errors?: string[]): ProblemDetails {
        return this.build({
            type: "bad-request",
            title: "Bad Request",
            status: HttpStatus.BAD_REQUEST,
            detail,
            instance,
            errors,
        });
    }

    internalError(detail: string, instance?: string): ProblemDetails {
        return this.build({
            type: "internal-server-error",
            title: "Internal Server Error",
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            detail,
            instance,
        });
    }

    fromHttpStatus(
        status: number,
        detail: string,
        instance?: string,
        errors?: string[],
    ): ProblemDetails {
        const typeByStatus: Record<number, { type: string; title: string }> = {
            [HttpStatus.BAD_REQUEST]: { type: "bad-request", title: "Bad Request" },
            [HttpStatus.UNAUTHORIZED]: { type: "unauthorized", title: "Unauthorized" },
            [HttpStatus.FORBIDDEN]: { type: "forbidden", title: "Forbidden" },
            [HttpStatus.NOT_FOUND]: { type: "not-found", title: "Not Found" },
            [HttpStatus.CONFLICT]: { type: "conflict", title: "Conflict" },
        };

        const mapped = typeByStatus[status] ?? {
            type: "http-error",
            title: "Error",
        };

        return this.build({
            ...mapped,
            status,
            detail,
            instance,
            errors,
        });
    }
}
