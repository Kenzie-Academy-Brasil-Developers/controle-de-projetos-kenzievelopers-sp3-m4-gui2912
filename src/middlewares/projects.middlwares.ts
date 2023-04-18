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

const ensureTechNameIsValidMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const techName:string = req.body.name || req.params.name
    const querySelect = `
    SELECT 
      *
    FROM
      technologies t
    WHERE t."name" = $1;
  `;

    const querySelectConfig: QueryConfig = {
        text: querySelect,
        values: [techName],
    };

    const { rowCount, rows }: QueryResult = await client.query(
        querySelectConfig
    );

    if (rowCount === 0) {
        return res.status(400).json({
            message: "Technology not supported.",
            options: [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB",
            ],
        });
    }

    res.locals.techFinded = rows[0]
    
    return next();
};

export { ensureProjectExistsMiddleware, ensureTechNameIsValidMiddleware };
