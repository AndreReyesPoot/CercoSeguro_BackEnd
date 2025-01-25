import { prisma } from "../db/index.js";

export const newDevices = async (req, res) => {
    console.log(req.body)
    const { id_wearable, numero_comprobacion } = req.body;

    if (!id_wearable || !numero_comprobacion) {
        return res.status(400).json({ message: "Los datos requeridos están vacíos", success: false });
    }

    try {
        const dataWearable = await prisma.wearablePair.create({
            data: {
                id_wearable,
                numero_comprobacion,
                numero_usuario: null,
            },
        });

        // Ahora la respuesta tiene la propiedad 'success'
        return res.status(200).json({ success: true, data: dataWearable });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const checkValidation = async (req, res) => {
  const { id_wearable, numero_comprobacion } = req.body;

  if (!id_wearable || !numero_comprobacion) {
      return res.status(400).json({ success: false, message: "Los datos requeridos están vacíos" });
  }

  try {
      const dataWearable = await prisma.wearablePair.findFirst({
          where: {
              id_wearable,
              numero_comprobacion,
          },
      });

      if (!dataWearable) {
          return res.status(400).json({ success: false, message: "Código no encontrado" });
      }

      const isSynced = dataWearable.numero_usuario === "synced";

      return res.status(200).json({
          success: isSynced,
          message: isSynced
              ? "El dispositivo ya está sincronizado"
              : "El dispositivo no está sincronizado",
          data: { isSynced },
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Error al verificar el dispositivo",
          error: error.message,
      });
  }
};

export const getWearableByCode = async (req, res) => {
  const { numero_comprobacion } = req.body;

  if (!numero_comprobacion) {
      return res.status(400).json({ message: "El código de verificación es requerido" });
  }

  try {
      const dataWearable = await prisma.wearablePair.findFirst({
          where: {
              numero_comprobacion,
          },
      });

      if (!dataWearable) {
          return res.status(404).json({ success: false, message: "Código no encontrado" });
      }

      return res.status(200).json({
          success: true,
          id_wearable: dataWearable.id_wearable,
          numero_comprobacion: dataWearable.numero_comprobacion,
      });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendLocation = async (req, res) => {
    const { id_wearable, latitude, longitude } = req.body;

    if (!id_wearable || !latitude || !longitude) {
        return res.status(400).json({ message: "Faltan datos requeridos", success: false });
    }

    try {
        // Verifica si el wearable está sincronizado en la tabla wearablePair
        const wearablePair = await prisma.wearablePair.findFirst({
            where: { id_wearable, numero_usuario: "synced" },
        });

        if (!wearablePair) {
            return res.status(404).json({ message: "Wearable no encontrado o no sincronizado", success: false });
        }

        // Asegúrate de que el wearable exista en la tabla Wearable
        let wearableExists = await prisma.wearable.findUnique({
            where: { ID_Wearable: id_wearable },
        });

        if (!wearableExists) {
            wearableExists = await prisma.wearable.create({
                data: { 
                    ID_Wearable: id_wearable,
                    Registro_ID: 0, // Usa un valor predeterminado si es necesario
                },
            });
        }

        // Usa upsert para actualizar o crear la ubicación
        const location = await prisma.ubicacion.upsert({
            where: { ID_Wearable: id_wearable },
            update: {
                Latitud: latitude,
                Longitud: longitude,
            },
            create: {
                ID_Wearable: id_wearable,
                Latitud: latitude,
                Longitud: longitude,
            },
        });

        return res.status(200).json({ success: true, data: location });
    } catch (error) {
        console.error("Error al guardar ubicación:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const pairWearable = async (req, res) => {
    const { id_wearable, numero_comprobacion } = req.body;

    if (!id_wearable || !numero_comprobacion) {
        return res.status(400).json({ success: false, message: "Los datos requeridos están vacíos" });
    }

    try {
        const dataWearable = await prisma.wearablePair.findFirst({
            where: { id_wearable, numero_comprobacion },
        });

        if (!dataWearable) {
            return res.status(400).json({ success: false, message: "Código de comprobación incorrecto" });
        }

        const updatedWearable = await prisma.wearablePair.update({
            where: { id: dataWearable.id },
            data: { numero_usuario: "synced" },
        });

        return res.status(200).json({
            success: true,
            message: "El dispositivo se ha sincronizado correctamente",
            data: updatedWearable,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al sincronizar el dispositivo",
            error: error.message,
        });
    }
};