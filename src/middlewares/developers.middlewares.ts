import { NextFunction, Request, Response } from "express";
import { TDeveloperRequest } from "../interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureDevEmailIsUniqueMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const data: string = req.body.email;

    if (data) {
        const queryString: string = `
            SELECT 
                *
            FROM 
                developers d
            WHERE
                d.email = $1;
        `;

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [data],
        };

        const { rowCount }: QueryResult = await client.query(queryConfig);

        if (rowCount > 0) {
            return res.status(409).json({
                message: "Email already exists.",
            });
        }

        return next();
    }

    return next();
};

const ensureDevExistsMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const id: number = +req.params.id || req.body.developerId;
    console.log(id);
    

    const queryString: string = `
        SELECT
            *
        FROM
            developers d
        WHERE
            d.id = $1
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    const { rowCount }: QueryResult = await client.query(queryConfig);

    if (rowCount === 0) {
        return res.status(404).json({
            message: "Developer not found.",
        });
    }

    return next()
};

export { ensureDevEmailIsUniqueMiddleware, ensureDevExistsMiddleware };
