process.loadEnvFile();

export const { CONNECTION_STRING_DB, PORT, SECRET_KEY, REFRESH_SECRET_KEY, NODE_ENV, SALT_ROUNDS } = process.env;
