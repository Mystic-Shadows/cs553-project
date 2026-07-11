export function logRequest(_req: any, _res: any, _next: any) {

    const receiveTime = Date.now();

    _res.on('finish', () => {
        console.log(
            `Finished processing request
    method: ${_req.method}
    path: ${_req.path}
    result: ${_res.statusCode}
    time to process: ${Date.now() - receiveTime} ms`
        )
    });

    _next();
}