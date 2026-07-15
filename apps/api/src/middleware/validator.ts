export function validateRequest(_req: any, _res: any, _next: any) {

    if ((_req.method === "POST" || _req.method === "PUT") && !validateTitle(_req)) {
        return _res.status(400).json({ error: "Bad Request", message: "Missing or Malformed Title" });
    }

    _next();
}

function validateTitle(_req: any) {
    const title = _req.body?.title?.trim();
    if (title && title !== "") {
        return true;
    } else {
        return false;
    }
}
