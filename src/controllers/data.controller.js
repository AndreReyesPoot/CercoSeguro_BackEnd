import { prisma } from "../db/index.js";

export const getDataUser = async (req, res) => {
	const { userId } = req.params;

	if (userId.length === 0) {
		return res
			.status(400)
			.json({ message: "Los datos requeridos se encuentran vacios" });
	}

	try {
		await prisma.$connect();

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

		await prisma.$disconnect();

		if (!dataUser) {
			return res.status(400).json({
				message:
					"Lo sentimos pero hemops tenido un problema con la busqueda de informacion",
			});
		}

		const { Usuario_Supervisado } = dataUser;

		return res.status(200).json({ Usuario_Supervisado });
	} catch (error) {
		return res.status(400).json({ error });
	}
};
