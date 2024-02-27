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
			return res.status(400).json({ error });
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
		return res.status(400).json({ error });
	}
};

export const registerUser = (req, res) => {
	const { name, age, phone, nss, username, password, isAdmin } = req.body;
	console.log(req.body);
	if (typeof isAdmin !== "boolean") {
		return res.status(400).json({ message: "el valor tiene que ser bolean" });
	}

	if (
		name.length === 0 ||
		username.length === 0 ||
		password.length === 0 ||
		phone.length === 0 ||
		nss.length === 0
	) {
		return res
			.status(400)
			.json({ message: "Los campos no pueden estar vacios" });
	}
	const pass = bcrypt.hashSync(password);

	console.log({ pass });

	return res.status(200).json({ message: "Regitro exitoso" });
};
