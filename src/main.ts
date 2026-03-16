import { config } from "./config.js";
import express from "express";
import lodash from "lodash";
import { strict as assert } from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Provider from "oidc-provider";

import configuration from "./oidc-provider-support/configuration.js";
import MemoryAdapter from "./oidc-provider-support/memory_adapter.js";
import { createUser, getDefaultUser, parseFormDataValue } from "./user-data.js";

const STYLESHEET_URL =
  "https://cdn.jsdelivr.net/gh/raj457036/attriCSS@master/themes/brightlight-green.css";

const { PORT, HOST, APP_NAME } = config;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src"));
app.enable("trust proxy");

const provider = new Provider(`https://${HOST}`, {
  adapter: MemoryAdapter,
  ...configuration,
} as any);
provider.proxy = true;

app.get("/interaction/:uid", async (req, res, next) => {
  try {
    const { uid, prompt, params, session } = await provider.interactionDetails(
      req,
      res,
    );

    const client = await provider.Client.find(params.client_id as string);

    const defaultUser = getDefaultUser();

    if (prompt.name === "login") {
      return res.render("index", {
        title: APP_NAME,
        stylesheetUrl: STYLESHEET_URL,
        uid,
        email: params?.login_hint || defaultUser.email,
        defaultUser,
        acr:
          lodash.get(prompt.details, "acr.value") ||
          lodash.get(prompt.details, "acr.values.0") ||
          (params?.acr_values as any)?.split(" ")[0] ||
          "eidas1",
        amr: "pwd",
        debugInfo: JSON.stringify(
          {
            oidcProviderPrompt: prompt,
            oidcProviderParams: params,
            oidcProviderSession: session,
            oidcProviderClient: client,
          },
          null,
          2,
        ),
      });
    }

    return next(new Error("unsupported_prompt"));
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

async function normalLogin(req: any, res: any) {
  try {
    const {
      prompt: { name },
    } = await provider.interactionDetails(req, res);
    assert.equal(name, "login");
    const { acr, amr, ...userAttributes } = req.body;
    const userId = createUser(userAttributes);

    const loginResult: {
      accountId: string;
      acr?: any;
      amr?: string[];
      ts: number;
    } = {
      accountId: userId,
      // the user is considered to have just logged in
      ts: Date.now(),
    };

    if (acr !== "") {
      loginResult.acr = parseFormDataValue(acr);
    }

    if (amr !== "") {
      loginResult.amr = amr.split(",");
    }

    const result = {
      login: loginResult,
      // skip the consent
      consent: {},
    };
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

app.post(
  "/interaction/:uid/login",
  express.urlencoded({ extended: false }),
  async (req, res, next) => {
    try {
      let result;
      if (req.body["error"]) {
        result = req.body;
      } else {
        result = await normalLogin(req, res);
      }

      await provider.interactionFinished(req, res, result);
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
);

app.use(provider.callback());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
