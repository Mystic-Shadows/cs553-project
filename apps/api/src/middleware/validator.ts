export function validateRequest(_req: any, _res: any, _next: any) {

    const title = _req.body?.title?.trim();

    if (_req.method === "POST" && !validatePostTasks(title)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing Title" });
    }

    _next();
}

function validatePostTasks(title: any) {
    if (title) {
        return true;
    } else {
        return false;
    }
}