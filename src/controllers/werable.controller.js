import { prisma } from "../db/index.js";

export const newDevices = async (req, res) => {
	const { id_wearable, numero_comprobacion } = req.body;

	if (!id_wearable || !numero_comprobacion) {
		return res.status(400).json({ message: "Los datos requeridos están vacíos" });
	}

	try {
	  const dataWearable = await prisma.wearablePair.create({
		data: {
		  id_wearable,
		  numero_comprobacion,
		},
	  });
  
	  return res.status(200).json(dataWearable);
	} catch (error) {
	  	return res.status(500).json({ message: error.message });
	}
};

  export const pairWearable = async (req, res) => {
	const { id_wearable, numero_comprobacion } = req.body;
  
	if (!id_wearable || !numero_comprobacion) {
	  return res.status(400).json({ message: 'Los datos requeridos están vacíos' });
	}
  
	try {
	  // Busca el wearable basado en `id_wearable` y `numero_comprobacion`
	  const dataWearable = await prisma.wearablePair.findFirst({
		where: {
		  id_wearable,
		  numero_comprobacion,
		},
	  });
  
	  if (!dataWearable) {
		return res.status(400).json({ message: 'Código de comprobación incorrecto' });
	  }
  
	  // Actualiza el estado del wearable
	  const updatedWearable = await prisma.wearablePair.update({
		where: {
		  id: dataWearable.id, // Usamos el campo `id`, que es único
		},
		data: {
		  numero_usuario: 'synced', // Marcar como sincronizado
		},
	  });
  
	  return res.status(200).json(updatedWearable);
	} catch (error) {
	  return res.status(500).json({ message: error.message });
	}
  };