import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  APP_NAME: process.env.APP_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URIS: process.env.REDIRECT_URIS,
  POST_LOGOUT_REDIRECT_URIS: process.env.POST_LOGOUT_REDIRECT_URIS,
  SCOPE: process.env.SCOPE,
  ID_TOKEN_SIGNED_RESPONSE_ALG: process.env.ID_TOKEN_SIGNED_RESPONSE_ALG,
  USERINFO_SIGNED_RESPONSE_ALG: process.env.USERINFO_SIGNED_RESPONSE_ALG,
};

export { config };
