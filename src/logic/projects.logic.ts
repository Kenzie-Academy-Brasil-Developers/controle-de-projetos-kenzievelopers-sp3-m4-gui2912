import { Request, Response } from "express";
import format from "pg-format";
import { TProductRequest, iProductRetrieved } from "../interfaces";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const data: TProductRequest = req.body;
    const queryString: string = format(
        `
        INSERT INTO
            projects(%I)
        VALUES(%L)
        RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    );

    const { rows }: QueryResult = await client.query(queryString);

    return res.status(201).json(rows[0]);
};

const retrieveProject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const projectId: number = +req.params.id;

    const queryString: string = `
    
    SELECT
        p."id" AS "projectId",
        p."name" AS "projectName",
        p."description" AS "projectDescription",
        p."estimatedTime" AS "projectEstimatedTime",
        p."repository" AS "projectRepository",
        p."startDate" AS "projectStartDate",
        p."endDate" AS "projectEndDate",
        p."developerId" AS "projectDeveloperId",
        t."id" as "technologyId",
        t."name" as "technologyName"
    FROM
        projects_technologies pt
    FULL OUTER JOIN
        projects p ON pt."projectId" = p."id"
    FULL OUTER JOIN
        technologies t ON pt."technologyId" = t."id"
    WHERE
        p."id" = $1;    
    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId],
    };

    const { rows }: QueryResult<iProductRetrieved> = await client.query(
        queryConfig
    );
    console.log(rows);

    return res.status(200).json(rows);
};

const updateProject = async (
    req: Request,
    res: Response
): Promise<Response> => {


    return res.status(200).json();
};

const deleteProject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const projectId:number = +req.params.id
    const queryString:string =
    `
        DELETE FROM 
            projects p
        WHERE   
            p."id" = $1;

    `

    const queryConfig:QueryConfig = {
        text: queryString,
        values: [projectId]
    }

     await client.query(queryConfig)



    return res.status(204).json();
};

const registerProjectTech = async (
    req: Request,
    res: Response
): Promise<Response> => {
    return res.status(201).json();
};

const deleteProjectTech = async (
    req: Request,
    res: Response
): Promise<Response> => {
    return res.status(201).json();
};

export {
    createProject,
    retrieveProject,
    updateProject,
    deleteProject,
    registerProjectTech,
    deleteProjectTech,
};
