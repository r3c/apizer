import bodyParser from "body-parser";
import express, { Response as ExResponse, Request as ExRequest } from "express";
import swagger from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/docs", swagger.serve, async (_req: ExRequest, res: ExResponse) => {
	return res.send(
		swagger.generateHTML(await import("../build/swagger.json"))
	);
});

RegisterRoutes(app);
