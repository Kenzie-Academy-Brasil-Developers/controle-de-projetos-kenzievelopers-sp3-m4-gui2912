import express, { Application } from "express";
import "dotenv/config";
import {
    createDeveloper,
    listDevelopers,
    retrieveDeveloperById,
    createDeveloperInfo,
    deleteDeveloper,
    updateDeveloper,
    createProject,
    retrieveProject,
    updateProject,
    deleteProject,
    registerProjectTech,
    deleteProjectTech,
} from "./logic";
import {
    ensureDevEmailIsUniqueMiddleware,
    ensureDevExistsMiddleware,
    ensureProjectExistsMiddleware,
    ensureTechNameIsValidMiddleware,
} from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/developers", ensureDevEmailIsUniqueMiddleware, createDeveloper);
app.get("/developers", listDevelopers);
app.get("/developers/:id", ensureDevExistsMiddleware, retrieveDeveloperById);
app.post(
    "/developers/:id/infos",
    ensureDevExistsMiddleware,
    createDeveloperInfo
);
app.delete("/developers/:id", ensureDevExistsMiddleware, deleteDeveloper);
app.patch(
    "/developers/:id",
    ensureDevExistsMiddleware,
    ensureDevEmailIsUniqueMiddleware,
    updateDeveloper
);

app.post("/projects", ensureDevExistsMiddleware, createProject);
app.get("/projects/:id", ensureProjectExistsMiddleware, retrieveProject);
app.patch(
    "/projects/:id",
    ensureProjectExistsMiddleware,
    ensureDevExistsMiddleware,
    updateProject
);
app.delete("/projects/:id", ensureProjectExistsMiddleware, deleteProject);
app.post(
    "/projects/:id/technologies",
    ensureTechNameIsValidMiddleware,
    ensureProjectExistsMiddleware,
    registerProjectTech
);
app.delete(
    "/projects/:id/technologies/:name",
    ensureProjectExistsMiddleware,
    ensureTechNameIsValidMiddleware,
    deleteProjectTech
);

export default app;
