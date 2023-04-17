interface iProduct {
    id: number;
    name: string;
    description: string;
    estimatedTime: string;
    repository: string;
    startDate: Date;
    endDate?: Date | null;
    developerId: number;
}

type TProductRequest = Omit<iProduct, "id">;

interface iProductRetrieved {
    projectId: number;
    projectName: string;
    projectDescription: string;
    projectEstimatedTime: string;
    projectRepository: string;
    projectStartDate: Date;
    projectEndDate: Date | null;
    projectDeveloperId: number;
    technologyId: number | null;
    technologyName: string | null;
}

export { iProduct, TProductRequest, iProductRetrieved };
