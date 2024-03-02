import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { apiRoutes, authRoutes, dataRoutes } from "./routes/index.js";

const app = express();

// * Configuraciones de Express
app.set("port", 3000);
app.set("case sensitive routing", true);

// *Se cargan los midlewares
app.use(express.json());
app.use(morgan("dev"));

// * se cargan las rutas
app.use(apiRoutes);
app.use(authRoutes);
app.use(dataRoutes);

// * Inicio de la aplicación

app.get("/", (_req, res) => {
	res.send("Welcome");
});

app.use((_req, res) => {
	res
		.status(404)
		.send("Lo sentimos pero no se ha encontrado la patgina solicitada");
});

app.listen(app.get("port"));
console.log(`Server on port ${app.get("port")}`);
