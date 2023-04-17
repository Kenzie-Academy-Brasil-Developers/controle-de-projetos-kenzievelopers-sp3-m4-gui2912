interface iDeveloper {
    id: number;
    name: string;
    email: string;
}

type TDeveloperRequest = Omit<iDeveloper, "id">;

interface iDeveloperListed {
    developerId: number;
    developerName: string;
    developerEmail: string;
    developerInfoDeveloperSince: Date | null;
    developerInfoPreferredOS: string | null;
}

interface iDeveloperInfo {
    id: number;
    developerSince: Date;
    preferredOS: "MacOS" | "Windows" | "Linux";
    developerId: number;
}

type TDeveloperInfoRequest = Omit<iDeveloperInfo, "id" | "developerId">

export { iDeveloper, TDeveloperRequest, iDeveloperListed, iDeveloperInfo, TDeveloperInfoRequest };
