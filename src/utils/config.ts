import "dotenv/config";

export const config = {
  PORT: String(process.env.PORT),
  MONGODB_URL: String(process.env.MONGODB_URL),
  GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET),
  SESSION_SECRET: String(process.env.SESSION_SECRET),
  JWT_SECRET: String(process.env.JWT_SECRET),
  ACCESS_TOKEN_EXPIRY: String(process.env.ACCESS_TOKEN_EXPIRY),
  REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY),
};

