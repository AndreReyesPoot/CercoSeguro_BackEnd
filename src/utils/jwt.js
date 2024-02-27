import jwt from "jsonwebtoken";

export const signToken = (User, tel, Name, ID_Tipo, user_in) => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error("No hay semilla de JWT - Revisar variables de entorno");
	}

	return jwt.sign(
		// *payload
		{ User, tel, Name, ID_Tipo, user_in },

		// *Seed
		process.env.JWT_SECRET_SEED,

		// *Opciones
		{ expiresIn: "15d" },
	);
};

export const isValidToken = (token) => {
	if (!process.env.JWT_SECRET_SEED) {
		throw new Error("No hay semilla de JWT - Revisar variables de entorno");
	}

	return new Promise((resolve, reject) => {
		try {
			jwt.verify(token, env.JWT_SECRET_SEED || "", (err, payload) => {
				if (err) return reject("JWT no es válido");

				const { Usuarios_id } = payload;

				resolve(Usuarios_id);
			});
		} catch (error) {
			reject("JWT no es válido");
		}
	});
};
