import bcrypt from "bcryptjs";
import { prisma } from "../db/db.js";
import { isValidEmail, signToken } from "../utils/index.js";

export const loginUser = async (req, res) => {
	const { user_in, password } = req.body;
	console.log({ user_in, password });

	if (user_in.length === 0 || password.length === 0) {
		return res.status(400).json({ message: "Datos vacios." });
	}

	if (isValidEmail(user_in)) {
		try {
			await prisma.$connect();

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

			await prisma.$disconnect();

			if (!userdb) {
				return res
					.status(404)
					.json({ message: "usuario o contraseña no validos." });
			}

			const { ID_Tipo, Name, User, tel, pass } = userdb;

			if (!bcrypt.compareSync(password, pass)) {
				return res
					.status(400)
					.json({ message: "usuario o contraseña no validos." });
			}
			console.log("HOla");
			const token = signToken(User, tel, Name, ID_Tipo, user_in);

			return res
				.status(200)
				.json({ usuario: { ID_Tipo, Name, User, tel, user_in }, token });
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}

	try {
		await prisma.$connect();

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

		if (!userdb) {
			return res
				.status(404)
				.json({ message: "usuario o contraseña no validos." });
		}

		await prisma.$disconnect();

		const { Name, ID_Tipo, tel, Email, pass } = userdb;
		if (!bcrypt.compareSync(password, pass)) {
			return res
				.status(400)
				.json({ message: "usuario o contraseña no validos." });
		}

		const token = signToken(User, tel, Name, ID_Tipo, user_in);

		return res
			.status(200)
			.json({ usuario: { ID_Tipo, Name, User, tel, user_in } }, token);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const registerUser = async (req, res) => {
	const { name, address, email, username, password, isAdmin, phone } = req.body;

	let roll = 2;

	if (typeof isAdmin !== "boolean") {
		return res.status(400).json({ message: "el valor tiene que ser bolean" });
	}

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

	if (!isValidEmail(email)) {
		return res.status(400).json({ message: "El campo correo no es correcto" });
	}

	const pass = bcrypt.hashSync(password);
	if (isAdmin === true) {
		roll = 1;
	}

	try {
		await prisma.$connect();

		await prisma.cuenta.create({
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

		await prisma.$disconnect();

		return res.status(200).json({ message: "Regitro exitoso" });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const supervised_user = async (req, res) => {
	const { uss_name, address, tel_uss, nss, id_cerco } = req.body;

	if (typeof id_cerco !== "number") {
		return res
			.status(400)
			.json({ message: "Se tiene un problema con el cerco seguro." });
	}

	if (uss_name <= 5 || address <= 5 || tel_uss <= 10 || nss <= 11) {
		return res.status(400).json({
			message: "Los datos estan vacios o no cumplen con el minimo requerido.",
		});
	}

	try {
		await prisma.$connect();

		const data = await prisma.usuario_Supervisado.create({
			data: {
				USS_name: uss_name,
				Address: address,
				Tel_USS: tel_uss,
				NSS: nss,
				ID_Cerco: id_cerco,
			},
		});

		await prisma.$disconnect();
		return res.status(200).json({ data });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const safe_fence = async (req, res) => {
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
		await prisma.$connect();

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

		await prisma.$disconnect();

		return res.status(200).json({ message: data });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const finishRegister = async (req, res) => {
	const { id_werable, id_us, id_uss } = req.body;

	if (
		id_werable.length <= 5 ||
		typeof id_us === "number" ||
		typeof id_uss === "number"
	) {
		return res.status(404).json({ message: "Se tiene un error en los datos" });
	}

	try {
		await prisma.$connect();

		await prisma.uS_USS_Weareable.create({
			data: {
				ID_Wearable: id_werable,
				ID_US: id_us,
				ID_USS: id_uss,
			},
		});

		await prisma.$disconnect();
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
