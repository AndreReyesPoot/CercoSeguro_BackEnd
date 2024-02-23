import bcrypt from "bcryptjs";

export const loginUser = (req, res) => {
	const { correo, password } = req.body;
	console.log({ correo, password });

	if (correo.length === 0 || password.length === 0) {
		return res.status(400).json({ message: "Datos vacios." });
	}

	if (
		!bcrypt.compareSync(
			password,
			"$2a$10$mQ7xLoyhkI5wSUIuDBfXhO0RmBIEy7ZlvY8UZ1xvTgYgL0g3YfyJ2",
		)
	) {
		return res.status(400).json({ message: "Password invalido" });
	}

	return res.status(200).json({ message: "El usuario es correcto" });
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
