export async function health(_req: any, _res: any) {
	_res.json({
		status: "ok",
		service: "cs553-api",
	});
}