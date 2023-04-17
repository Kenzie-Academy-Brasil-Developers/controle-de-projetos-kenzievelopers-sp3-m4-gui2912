import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
    TDeveloperInfoRequest,
    TDeveloperRequest,
    iDeveloper,
    iDeveloperListed,
} from "../interfaces";

const createDeveloper = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const data: iDeveloper = req.body;

    if (data.email.length > 50 || data.name.length > 50) {
        return res.status(400).json({
            message: "Too long strings in email or name inputs.",
        });
    }

    const queryString: string = format(
        `
            INSERT INTO
                developers(%I)
            VALUES
                (%L)
            RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    );

    const { rows }: QueryResult<iDeveloper> = await client.query(queryString);

    return res.status(201).json(rows[0]);
};

const listDevelopers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const queryString: string = `
        SELECT 
            *
        FROM
            developers
    `;

    const { rows }: QueryResult = await client.query(queryString);

    return res.status(200).json(rows);
};

const retrieveDeveloperById = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const id: number = +req.params.id;

    const queryString: string = `
        SELECT 
            d."id" AS "developerId",
            d."name" AS "developerName",
            d."email" AS "developerEmail",
            di."developerSince" AS "developerInfoDeveloperSince",
            di."preferredOS" AS "developerInfoPreferredOS"
        FROM
            developers d
        FULL OUTER JOIN 
            developer_infos  di ON d."id" = di."developerId"
        WHERE
            d.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    const { rows }: QueryResult<iDeveloperListed> = await client.query(
        queryConfig
    );

    return res.status(200).json(rows[0]);
};

const createDeveloperInfo = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const data: TDeveloperInfoRequest = req.body;
        const devId: number = +req.params.id;

        const infoDataValues = Object.values(data);
        console.log(infoDataValues);

        const enumPrefOS: string[] = ["MacOS", "Windows", "Linux"];
        const ensurePrefOS = enumPrefOS.some((elt: any) =>
            infoDataValues.includes(elt)
        );

        if (!ensurePrefOS) {
            return res.status(400).json({
                message: "Invalid OS option.",
                options: ["Windows", "Linux", "MacOS"],
            });
        }

        const configData = {
            ...data,
            developerId: devId,
        };

        const queryString = format(
            `
            INSERT INTO
                developer_infos(%I)
            VALUES 
                (%L)
            RETURNING *;
          `,
            Object.keys(configData),
            Object.values(configData)
        );

        const { rows }: QueryResult = await client.query(queryString);

        return res.status(201).json(rows[0]);
    } catch (error: any) {
        console.log(error.constraint);
        if (error.constraint === "developer_infos_developerId_key") {
            return res.status(409).json({
                message: "Developer infos already exists.",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const deleteDeveloper = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const devId: number = +req.params.id;

    const queryString: string = `
        DELETE FROM
            developers dv
        WHERE
            dv.id = $1;
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId],
    };

    await client.query(queryConfig);

    return res.status(204).json();
};

const updateDeveloper = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const devId: number = +req.params.id;
        const data: TDeveloperRequest = req.body;

        const queryString: string = format(
            `
                UPDATE
                    developers dv
                SET
                    (%I) = ROW(%L)
                WHERE
                    dv."id" = $1
                RETURNING *;
            `,
            Object.keys(data),
            Object.values(data)
        );

        const queryConfig: QueryConfig = {
            text: queryString,
            values: [devId],
        };

        const { rows }: QueryResult = await client.query(queryConfig);

        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error.",
        });
    }
};

export {
    createDeveloper,
    listDevelopers,
    retrieveDeveloperById,
    createDeveloperInfo,
    deleteDeveloper,
    updateDeveloper,
};
