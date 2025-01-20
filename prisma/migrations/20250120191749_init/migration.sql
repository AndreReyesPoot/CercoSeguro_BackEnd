-- CreateTable
CREATE TABLE "Cerco_Seguro" (
    "ID_Cerco" SERIAL NOT NULL,
    "P_Latitud" DECIMAL NOT NULL,
    "P_Longitud" DECIMAL NOT NULL,
    "S_Latitud" DECIMAL NOT NULL,
    "S_Longitud" DECIMAL NOT NULL,
    "T_Latitud" DECIMAL NOT NULL,
    "T_Longitud" DECIMAL NOT NULL,
    "C_Latitud" DECIMAL NOT NULL,
    "C_Longitud" DECIMAL NOT NULL,

    CONSTRAINT "Cerco_Seguro_pkey" PRIMARY KEY ("ID_Cerco")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "ID_US" SERIAL NOT NULL,
    "Name" VARCHAR NOT NULL,
    "Address" VARCHAR NOT NULL,
    "Email" VARCHAR NOT NULL,
    "User" VARCHAR NOT NULL,
    "tel" VARCHAR NOT NULL,
    "pass" VARCHAR NOT NULL,
    "ID_Tipo" INTEGER NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("ID_US")
);

-- CreateTable
CREATE TABLE "Tipo_Usuario" (
    "ID_Tipo" SERIAL NOT NULL,
    "Tipo" VARCHAR NOT NULL,

    CONSTRAINT "Tipo_Usuario_pkey" PRIMARY KEY ("ID_Tipo")
);

-- CreateTable
CREATE TABLE "US_USS_Weareable" (
    "ID_US_USS_Weareable" SERIAL NOT NULL,
    "ID_US" INTEGER NOT NULL,
    "ID_Wearable" VARCHAR NOT NULL,
    "ID_USS" INTEGER NOT NULL,

    CONSTRAINT "US_USS_Weareable_pkey" PRIMARY KEY ("ID_US_USS_Weareable")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "ID_Ubicacion" SERIAL NOT NULL,
    "Latitud" DECIMAL NOT NULL,
    "Longitud" DECIMAL NOT NULL,
    "ID_Wearable" VARCHAR NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("ID_Ubicacion")
);

-- CreateTable
CREATE TABLE "Usuario_Supervisado" (
    "ID_USS" SERIAL NOT NULL,
    "USS_name" VARCHAR NOT NULL,
    "Address" VARCHAR NOT NULL,
    "Tel_USS" VARCHAR NOT NULL,
    "NSS" VARCHAR NOT NULL,
    "ID_Cerco" INTEGER NOT NULL,

    CONSTRAINT "Usuario_Supervisado_pkey" PRIMARY KEY ("ID_USS")
);

-- CreateTable
CREATE TABLE "Wearable" (
    "ID_Wearable" VARCHAR NOT NULL,
    "Registro_ID" INTEGER NOT NULL,

    CONSTRAINT "Wearable_pkey" PRIMARY KEY ("ID_Wearable")
);

-- CreateTable
CREATE TABLE "wearablePair" (
    "id" SERIAL NOT NULL,
    "id_wearable" VARCHAR NOT NULL,
    "numero_comprobacion" VARCHAR NOT NULL,
    "numero_usuario" VARCHAR,

    CONSTRAINT "wearablePair_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_Email_key" ON "Cuenta"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_User_key" ON "Cuenta"("User");

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_tel_key" ON "Cuenta"("tel");

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_ID_Tipo_fkey" FOREIGN KEY ("ID_Tipo") REFERENCES "Tipo_Usuario"("ID_Tipo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "US_USS_Weareable" ADD CONSTRAINT "US_USS_Weareable_ID_USS_fkey" FOREIGN KEY ("ID_USS") REFERENCES "Usuario_Supervisado"("ID_USS") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "US_USS_Weareable" ADD CONSTRAINT "US_USS_Weareable_ID_US_fkey" FOREIGN KEY ("ID_US") REFERENCES "Cuenta"("ID_US") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "US_USS_Weareable" ADD CONSTRAINT "US_USS_Weareable_ID_Wearable_fkey" FOREIGN KEY ("ID_Wearable") REFERENCES "Wearable"("ID_Wearable") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_ID_Wearable_fkey" FOREIGN KEY ("ID_Wearable") REFERENCES "Wearable"("ID_Wearable") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuario_Supervisado" ADD CONSTRAINT "Usuario_Supervisado_ID_Cerco_fkey" FOREIGN KEY ("ID_Cerco") REFERENCES "Cerco_Seguro"("ID_Cerco") ON DELETE NO ACTION ON UPDATE NO ACTION;
