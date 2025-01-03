import { prisma } from "../db/index.js";

export const newDivices = async (req, res) => {
	const { id_Wearable, numero_comprobacion } = req.body;

	if (id_Wearable.length === 0 || numero_comprobacion.length === 0) {
		return res
			.status(400)
			.json({ message: "Los datos requeridos se encuentran vacios" });
	}

	try {
		await prisma.$connect();
		const dataWerable = await prisma.wearablePair.create({
			data: {
				id_wearable,
				numero_comprobacion,
			},
		});
		await prisma.$disconnect();

		if (!dataWerable) {
			return res
				.status(400)
				.json({ message: "No se pudo registrar el werable" });
		}

		return res.status(200).json(dataWerable);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};

export const paierWerable = async (req, res) => {
	const { id_werable, numero_usuario } = req.body;

	if (id_werable.length === 0 || numero_usuario.length === 0) {
		return res
			.status(400)
			.json({ message: "Los datos requeridos se encuentran vacios" });
	}

	try {
		await prisma.$connect();
		const dataWerableUpdate = await prisma.wearablePair.update({
			where: {
				id_wearable,
			},
			data: {
				numero_usuario,
			},
		});
		await prisma.$disconnect();

		if (!dataWerableUpdate) {
			return res
				.status(400)
				.json({ message: "No se pudo sincronizar el werable" });
		}
		return res.status(200).json(dataWerableUpdate);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
};
