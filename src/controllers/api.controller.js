import { prisma } from "../db/db.js";
import { isEmail } from "../utils/validations.js";

export const supervisorPUT = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { userId } = req.params;
	const { name, address, phone, email, user, isAdmin } = req.body;

	let roll = 2;

	// * se validan los datos que cumplan con los tipos de datos
	if (typeof isAdmin !== "boolean") {
		return res
			.status(400)
			.json({ message: "Se tiene un problema con el tipo de datos" });
	}

	// * se validan los datos que cumplan con los tipos de datos
	if (
		name.length <= 5 ||
		address.length <= 5 ||
		phone.length <= 5 ||
		!isEmail(email) ||
		user.length <= 5
	) {
		return res.status(400).json({
			message: "Se tiene un error en los datos, un campo o mas esta vacio",
		});
	}

	// * asigna el rtipo de roll
	if (isAdmin === true) {
		roll = 1;
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (acrtualiza la tupla)
		const data = await prisma.cuenta.update({
			data: {
				Address: address,
				Email: email,
				Name: name,
				telephone: phone,
				ID_Tipo: roll,
				User: user,
			},
			where: {
				ID_US: userId,
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
			.json({ userId, name, address, phone, email, user, isAdmin });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).jhs({ message: error.message });
	}
};

export const updatePoints = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { markers, id_cerco } = req.body;
	const { marker1, marker2, marker3, marker4 } = markers;

	// * se validan los datos que cumplan con los tipos de datos
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

	// * se validan los datos que cumplan con los tipos de datos
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
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (actualizar la tupla)
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

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!data) {
			return res.status(400).json({ message: "Error al actualizar los datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res.status(200).json({
			message: "El cerco seguro se actuializo de forma correcta.",
			data,
		});
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).jhs({ message: error.message });
	}
};
