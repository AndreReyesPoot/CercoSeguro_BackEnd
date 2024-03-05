import { prisma } from "../db/db.js";

export const supervisorPUT = (req, res) => {
	const { userId } = req.params;
	const { name, address, phone, email, user, password, isAdmin } = req.body;

	if (typeof isAdmin !== "boolean") {
		return res
			.status(400)
			.json({ message: "Se tiene un problema con el tipo de datos" });
	}
	if (
		name.length === 0 ||
		address.length === 0 ||
		phone.length === 0 ||
		email.length === 0 ||
		user.length === 0 ||
		password.length === 0
	) {
		return res.status(400).json({
			message: "Se tiene un error en los datos, un campo o mas esta vacio",
		});
	}

	return res
		.status(200)
		.json({ userId, name, address, phone, email, user, password, isAdmin });
};

export const updatePoints = async (req, res) => {
	const { markers, id_cerco } = req.body;
	const { marker1, marker2, marker3, marker4 } = markers;
	if (
		typeof marker1.latitud !== "number" ||
		typeof marker2.latitud !== "number" ||
		typeof marker3.latitud !== "number" ||
		typeof marker3.latitud !== "number"
	) {
		return res.status(400).json({
			message:
				"Lo sentimos una de las latitudes no cuentan con el formato correcto.",
		});
	}

	if (
		typeof marker1.longitud !== "number" ||
		typeof marker2.longitud !== "number" ||
		typeof marker3.longitud !== "number" ||
		typeof marker4.longitud !== "number"
	) {
		return res.status(400).json({
			message:
				"Lo sentimos una de las longitudes no cuentan con el formato correcto.",
		});
	}

	try {
		await prisma.$connect();

		const data = await prisma.cerco_Seguro.update({
			where: {
				ID_Cerco: id_cerco,
			},
			data: {
				P_Latitud: marker1.latitud,
				P_Longitud: marker1.longitud,
				S_Latitud: marker2.latitud,
				S_Longitud: marker2.longitud,
				T_Latitud: marker3.latitud,
				T_Longitud: marker3.longitud,
				C_Latitud: marker4.latitud,
				C_Longitud: marker4.longitud,
			},
		});

		await prisma.$disconnect();

		return res.status(200).json({
			message: "El cerco seguro se actuializo de forma correcta.",
			data,
		});
	} catch (error) {
		return res.status(400).jhs({ message: error.message });
	}
};
