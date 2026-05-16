export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: string[];
}

export const PROBLEM_CONTENT_TYPE = "application/problem+json";
