import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureProjectExistsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const projectId: number = +req.params.id;

    const queryString: string = `
        SELECT 
            *
        FROM
            projects p
        WHERE
            p."id" = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId],
    };

    const { rowCount }: QueryResult = await client.query(queryConfig);

    if (rowCount === 0) {
        return res.status(404).json({
            message: "Project not found.",
        });
    }

    return next();
};

export { ensureProjectExistsMiddleware };
