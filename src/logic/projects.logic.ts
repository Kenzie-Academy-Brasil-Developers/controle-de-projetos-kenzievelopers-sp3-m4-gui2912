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
    const projectId: number = +req.params.id;
    const data: Partial<TProductRequest> = req.body;

    const queryString: string = format(
        `
            UPDATE
                projects p
            SET
                (%I) = ROW(%L)
            WHERE
                p."id" = $1
            RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    );

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId],
    };

    const { rows }: QueryResult = await client.query(queryConfig);

    return res.status(200).json(rows[0]);
};

const deleteProject = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const projectId: number = +req.params.id;
    const queryString: string = `
        DELETE FROM 
            projects p
        WHERE   
            p."id" = $1;

    `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId],
    };

    await client.query(queryConfig);

    return res.status(204).json();
};

const registerProjectTech = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const projectId: number = +req.params.id;
    const tecRequest = req.body;

    const querySelect = `
    SELECT 
      t."id"
    FROM
      technologies AS t
    WHERE t."name" = $1;
  `;

    const querySelectConfig: QueryConfig = {
        text: querySelect,
        values: [tecRequest.name],
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

    const queryString: string = `
    INSERT INTO 
        projects_technologies ("addedIn", "projectId", "technologyId")
    VALUES (now(), $1, $2)
        RETURNING *;
  `;

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId, rows[0].id],
    };

    await client.query(queryConfig);

    const queryStringJoined: string = `
    SELECT 
      t."id" AS "technologyId",
      t."name" AS "technologyName",
      p."id" AS "projectId",
      p."name" AS "projectName",
      p."description" AS "projectDescription",
      p."estimatedTime" AS "projectEstimatedTime",
      p."repository" AS "projectRepository",
      p."startDate" AS "projectStartDate",
      p."endDate" AS "projectEndDate"
    FROM
      projects_technologies pt
    FULL OUTER JOIN
      projects p ON pt."projectId" = p."id"
    FULL OUTER JOIN
      technologies t ON pt."technologyId" = t."id"
    WHERE
      pt."projectId" = $1;
  `;

    const queryConfigJoined: QueryConfig = {
        text: queryStringJoined,
        values: [projectId],
    };

    const queryResultJoined: QueryResult = await client.query(
        queryConfigJoined
    );

    if(tecRequest.name === queryResultJoined.rows[0].technologyName){
        return res.status(409).json({
            message: 'This technology is already associated with the project'
        })
    }

    return res.status(201).json(queryResultJoined.rows[0]);
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
