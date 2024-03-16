import bcrypt from "bcryptjs";
import { prisma } from "../db/db.js";
import { isValidEmail, signToken } from "../utils/index.js";

export const loginUser = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { user_in, password } = req.body;
	console.log({ user_in, password });

	// * se validan los datos que cumplan con los tipos de datos
	if (user_in.length === 0 || password.length === 0) {
		return res.status(400).json({ message: "Datos vacios." });
	}

	// * Si es un correo valio el usuario ingresado entonces se va a intentar acceder por este
	if (isValidEmail(user_in)) {
		try {
			// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
			await prisma.$connect();

			// * se hace la peticion SQL a la db (busqueda de una tupla)
			const userdb = await prisma.cuenta.findUnique({
				where: {
					Email: user_in,
				},
				select: {
					Name: true,
					ID_Tipo: true,
					tel: true,
					User: true,
					pass: true,
				},
			});

			// * se cierra la coneecion de a la DB
			await prisma.$disconnect();

			// * Validacion de que no se nos arroje un null en la creacion de los datos
			if (!userdb) {
				return res
					.status(404)
					.json({ message: "usuario o contraseña no validos." });
			}

			// * se destructura la respuesta
			const { ID_Tipo, Name, User, tel, pass } = userdb;

			// * se compara el hash arrojado por la db con la contraseña ingresada por el usuario
			if (!bcrypt.compareSync(password, pass)) {
				return res
					.status(400)
					.json({ message: "usuario o contraseña no validos." });
			}
			// * se genera un JsonWebToken
			const token = signToken(User, tel, Name, ID_Tipo, user_in);

			// * se retorna la respuesta para su uso en el front-end
			return res
				.status(200)
				.json({ usuario: { ID_Tipo, Name, User, tel, user_in }, token });
		} catch (error) {
			// *si se tiene un error en las peticiones a la DB recae en el error
			return res.status(400).json({ message: error.message });
		}
	}

	// * al no ser un correo electronico se intenta acceder por medio del user
	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (slecciona la tupla)
		const userdb = await prisma.cuenta.findUnique({
			where: {
				User: user_in,
			},
			select: {
				Name: true,
				ID_Tipo: true,
				tel: true,
				Email: true,
				pass: true,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!userdb) {
			return res
				.status(404)
				.json({ message: "usuario o contraseña no validos." });
		}

		// * se destructura la respuesta
		const { Name, ID_Tipo, tel, Email, pass } = userdb;

		// * se compara el hash arrojado por la db con la contraseña ingresada por el usuario
		if (!bcrypt.compareSync(password, pass)) {
			return res
				.status(400)
				.json({ message: "usuario o contraseña no validos." });
		}

		// * Se genera el JsonWebToken
		const token = signToken(User, tel, Name, ID_Tipo, user_in);

		// * se retorna la respuesta para su uso en el front-end
		return res
			.status(200)
			.json({ usuario: { ID_Tipo, Name, User, tel, user_in } }, token);
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const registerUser = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { name, address, email, username, password, isAdmin, phone } = req.body;

	let roll = 2;

	// * se validan los datos que cumplan con los tipos de datos
	if (typeof isAdmin !== "boolean") {
		return res.status(400).json({ message: "el valor tiene que ser bolean" });
	}

	// * se validan los datos que cumplan con los tipos de datos
	if (
		name.length <= 5 ||
		address.length <= 5 ||
		username.length <= 5 ||
		password.length <= 6 ||
		phone.length <= 10
	) {
		return res.status(400).json({
			message:
				"Los campos no pueden estar vacios, o no cumplen con el minimo requerido.",
		});
	}

	// * se validan los datos que cumplan con los tipos de datos
	if (!isValidEmail(email)) {
		return res.status(400).json({ message: "El campo correo no es correcto" });
	}
	// * Se hace el encriptado de la contraseña
	const pass = bcrypt.hashSync(password);

	// * se hace el cambio de rol si es admin o no
	if (isAdmin === true) {
		roll = 1;
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.

		await prisma.$connect();

		// * se hace la peticion SQL a la db (crear la tupla)
		const data = await prisma.cuenta.create({
			data: {
				Name: name,
				Address: address,
				Email: email,
				User: username,
				tel: phone,
				pass,
				ID_Tipo: roll,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!data) {
			return res.status(400).json({ message: "Error al crear los datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res.status(200).json({ message: "Regitro exitoso" });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const supervised_user = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { uss_name, address, tel_uss, nss, id_cerco } = req.body;

	// * se validan los datos que cumplan con los tipos de datos
	if (typeof id_cerco !== "number") {
		return res
			.status(400)
			.json({ message: "Se tiene un problema con el cerco seguro." });
	}

	// * se validan los datos que cumplan con los tipos de datos
	if (uss_name <= 5 || address <= 5 || tel_uss <= 10 || nss <= 11) {
		return res.status(400).json({
			message: "Los datos estan vacios o no cumplen con el minimo requerido.",
		});
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (crear la tupla)
		const data = await prisma.usuario_Supervisado.create({
			data: {
				USS_name: uss_name,
				Address: address,
				Tel_USS: tel_uss,
				NSS: nss,
				ID_Cerco: id_cerco,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!data) {
			return res.status(400).json({ message: "Error al crear los datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res.status(200).json({ data });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const safe_fence = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const {
		p_latitud,
		p_logitud,
		s_latitud,
		s_logitud,
		t_latitud,
		t_logitud,
		c_latitud,
		c_logitud,
	} = req.body;

	// * se validan los datos que cumplan con los tipos de datos
	if (
		typeof p_latitud !== "number" ||
		typeof p_logitud !== "number" ||
		typeof s_latitud !== "number" ||
		typeof s_logitud !== "number" ||
		typeof t_latitud !== "number" ||
		typeof t_logitud !== "number" ||
		typeof c_latitud !== "number" ||
		typeof c_logitud !== "number"
	) {
		return res.status(400).json({
			message:
				"El tipo de dato no es el correcto, este tiene que ser de tipo numerico.",
		});
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (crear la tupla)
		const data = await prisma.cerco_Seguro.create({
			data: {
				P_Latitud: p_latitud,
				P_Longitud: p_latitud,
				S_Latitud: s_latitud,
				S_Longitud: s_latitud,
				T_Latitud: t_latitud,
				T_Longitud: t_latitud,
				C_Latitud: c_latitud,
				C_Longitud: c_latitud,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!data) {
			return res.status(400).json({ message: "Error al crear los datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res.status(200).json({ message: data });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};

export const finishRegister = async (req, res) => {
	// * se destructura los parametros que se mandan desde el front
	const { id_werable, id_us, id_uss, latitud, longitud } = req.body;

	// * se validan los datos que cumplan con los tipos de datos
	if (
		typeof id_werable !== "string" ||
		typeof id_us !== "number" ||
		typeof id_uss !== "number" ||
		typeof latitud !== "number" ||
		typeof longitud !== "number"
	) {
		return res.status(404).json({ message: "Se tiene un error en los datos" });
	}

	try {
		// * se abre la  coneccion con la db para realizar una consulta SQL por medio de prisma ORM.
		await prisma.$connect();

		// * se hace la peticion SQL a la db (crear la tupla)
		const uss_rerable = await prisma.uS_USS_Weareable.create({
			data: {
				ID_Wearable: id_werable,
				ID_US: id_us,
				ID_USS: id_uss,
			},
		});

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!uss_rerable) {
			return res
				.status(404)
				.json({ message: "se tiene fallos en la creacion de algunos datos" });
		}

		// * se hace la peticion SQL a la db (crear la tupla)
		const located = await prisma.ubicacion.create({
			data: {
				Latitude: latitud,
				Longitude: longitud,
				ID_Wearable: id_werable,
			},
		});

		// * se cierra la coneecion de a la DB
		await prisma.$disconnect();

		// * Validacion de que no se nos arroje un null en la creacion de los datos
		if (!located) {
			return res
				.status(404)
				.json({ message: "se tiene fallos en la creacion de algunos datos" });
		}

		// * se retorna la respuesta para su uso en el front-end
		return res
			.status(200)
			.json({ message: "El registro se termino con exito" });
	} catch (error) {
		// *si se tiene un error en las peticiones a la DB recae en el error
		return res.status(400).json({ message: error.message });
	}
};
