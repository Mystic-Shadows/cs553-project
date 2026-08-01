import { doesUserExist } from "./usersValidators";
import { doesProjectExist } from "./projectsValidators";

export async function validateAuthorizations(_req: any, _res: any, _next: any) {

    if (!validateTypes(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Incorrect Types or missing values" });
    }

    if (_req.body?.userId !== undefined && _req.body?.userId?.trim() !== "") {
        var optResponse = await doesUserExist(Number(_req.body?.userId));
        if (optResponse[0] && !optResponse[1]) { // does not exist
            return _res.status(404).json({ error: "User not found" });
        } else if (!optResponse[0]) { //error occurred
            return _res.status(500).json({ status: "error", message: "Failed to find User" });
        }
    }

    if (_req.body?.projectId !== undefined && _req.body?.projectId?.trim() !== "") {
        var optResponse = await doesProjectExist(Number(_req.body?.projectId));
        if (optResponse[0] && !optResponse[1]) { // does not exist
            return _res.status(404).json({ error: "Project not found" });
        } else if (!optResponse[0]) { //error occurred
            return _res.status(500).json({ status: "error", message: "Failed to find Project" });
        }
    }

    _next();
}

function validateTypes(_req: any) {
    const userId = _req.body?.userId?.trim();
    const projectId = _req.body?.projectId?.trim();

    if ((userId !== undefined && isNaN(userId)) ||
        (userId !== undefined && isNaN(projectId))
    ) {
        return false;
    }

    return true;
}