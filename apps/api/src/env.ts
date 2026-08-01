// In a real deployment, set JWT_SECRET to a long random value kept outside git.
// The fallback keeps this classroom example runnable without cloud infrastructure.
export const jwtSecret = process.env.JWT_SECRET ?? "development-secret";
export const jwtExpiresIn = "1h";