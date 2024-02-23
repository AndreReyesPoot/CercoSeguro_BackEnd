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
	const { userId } = req.params;
	const { markers } = req.body;
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

		const id_cerco = await prisma.usuario_Supervisado.findUnique({
			select: {
				ID_Cerco,
			},
			where: {
				ID_USS: userId,
			},
		});

		await prisma.cerco_Seguro.update({
			where: {
				ID_Cerco: id_cerco.ID_Cerco,
			},
			data: {},
		});

		await prisma.$extends();
	} catch (error) {}

	return res.status(200).json({ userId, markers });
};
