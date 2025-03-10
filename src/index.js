import "dotenv/config";
import express from "express";
import morgan from "morgan";
import {
	apiRoutes,
	authRoutes,
	dataRoutes,
	werableRoutes,
} from "./routes/index.js";

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
app.use(werableRoutes);

// * Inicio de la aplicación
app.use((_req, res) => {
	res
		.status(404)
		.send("Lo sentimos pero no se ha encontrado la patgina solicitada");
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
console.log(`Server on port ${app.get("port")}`);
