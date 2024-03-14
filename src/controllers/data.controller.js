import { prisma } from "../db/index.js";

export const getDataUser = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { userId } = req.params;

	// * se validan los datos que cumplan con los tipos de datos
	if (userId.length === 0) {
		return res
			.status(400)
			.json({ message: "Los datos requeridos se encuentran vacios" });
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (busca la tupla)
		const dataUser = await prisma.uS_USS_Weareable.findFirst({
			select: {
				Usuario_Supervisado: {
					select: {
						USS_name: true,
						Address: true,
						Tel_USS: true,
						NSS: true,
						Cerco_Seguro: true,
					},
				},
			},
			where: {
				ID_US: Number(userId),
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!dataUser) {
			return res.status(400).json({
				message:
					"Lo sentimos pero hemops tenido un problema con la busqueda de informacion",
			});
		}

		// *se destructura la respuesta dada por la db
		const { Usuario_Supervisado } = dataUser;

		// * se retorna la respuesta para su uso en el front-end
		return res.status(200).json({ Usuario_Supervisado });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const updateSafeFence = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const {
		P_Latitud,
		P_Longitud,
		S_Latitud,
		S_Longitud,
		T_Latitud,
		T_Longitud,
		C_Latitud,
		C_Longitud,
		ID_USS,
	} = req.body;

	// * se validan los datos que cumplan con los tipos de datos
	if (
		typeof P_Latitud !== "number" ||
		typeof P_Longitud !== "number" ||
		typeof S_Latitud !== "number" ||
		typeof S_Longitud !== "number" ||
		typeof T_Latitud !== "number" ||
		typeof T_Longitud !== "number" ||
		typeof C_Latitud !== "number" ||
		typeof C_Longitud !== "number"
	) {
		return res.status(400).json({ message: "Error en los tipos de datos" });
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (actualiza la tupla)
		const updateFence = await prisma.usuario_Supervisado.update({
			data: {
				Cerco_Seguro: {
					update: {
						P_Latitud,
						P_Longitud,
						S_Latitud,
						S_Longitud,
						T_Latitud,
						T_Longitud,
						C_Latitud,
						C_Longitud,
					},
				},
			},
			where: {
				ID_USS,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!updateFence) {
			return res
				.status(404)
				.json({ message: "Se tiene un error en la coneccion" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res
			.status(200)
			.json({ message: "Se actualizo con exito el cerco seguro" });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const updateLocated = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { idWerable, latitud, longitud } = req.body;

	// * se validan los datos que cumplan con los tipos de datos
	if (
		typeof latitud !== "number" ||
		typeof longitud !== "number" ||
		typeof idWerable !== "string"
	) {
		return res
			.status(400)
			.json({ message: "Se ntiene un error con los datos" });
	}
	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (actualiza la tupla)
		const data = await prisma.ubicacion.update({
			data: {
				Latitud: latitud,
				Longitud: longitud,
			},
			where: {
				ID_Wearable: idWerable,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!data) {
			return res.status(400).json({ message: "Error al crear los datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res
			.status(200)
			.json({ message: "Se actualizaron los datos con exito" });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};
