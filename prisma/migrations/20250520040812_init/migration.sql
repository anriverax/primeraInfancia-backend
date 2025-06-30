-- CreateEnum
CREATE TYPE "TypeRole" AS ENUM ('ADMIN', 'USER', 'FORMADOR', 'MENTOR', 'TECNICO_APOYO', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "TypePersonEnum" AS ENUM ('FORMADOR', 'MENTOR', 'TECNICO_APOYO', 'DOCENTE', 'DIRECTOR', 'EMPLEADO');

-- CreateEnum
CREATE TYPE "TypeGender" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "TypePerson" (
    "id" SERIAL NOT NULL,
    "name" "TypePersonEnum" NOT NULL,

    CONSTRAINT "TypePerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "TypeRole" NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PermissionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModulePermission" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "permissionTypeId" INTEGER NOT NULL,

    CONSTRAINT "ModulePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "geonameId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "municipalityId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoredEvent" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StoredEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "roleId" INTEGER NOT NULL,
    "modulePermissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,
    "modulePermissionId" INTEGER,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "firstName1" TEXT NOT NULL,
    "firstName2" TEXT NOT NULL,
    "lastName1" TEXT NOT NULL,
    "lastName2" TEXT NOT NULL,
    "dui" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" "TypeGender" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dateBirth" TEXT NOT NULL,
    "duiImage" TEXT[],
    "districtId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "typePersonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Academic" (
    "id" SERIAL NOT NULL,
    "career" TEXT NOT NULL,
    "nip" INTEGER,
    "cvImage" TEXT NOT NULL,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonOf" (
    "id" SERIAL NOT NULL,
    "inChargeId" INTEGER NOT NULL,
    "assignedId" INTEGER NOT NULL,

    CONSTRAINT "PersonOf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwd" TEXT NOT NULL,
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roleId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_name_key" ON "Module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PermissionType_name_key" ON "PermissionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_geonameId_key" ON "Department"("geonameId");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_name_key" ON "Municipality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Person_dui_key" ON "Person"("dui");

-- CreateIndex
CREATE UNIQUE INDEX "Person_publicKey_key" ON "Person"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "Person_privateKey_key" ON "Person"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "Academic_personId_key" ON "Academic"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_personId_key" ON "User"("personId");

-- AddForeignKey
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulePermission" ADD CONSTRAINT "ModulePermission_permissionTypeId_fkey" FOREIGN KEY ("permissionTypeId") REFERENCES "PermissionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_modulePermissionId_fkey" FOREIGN KEY ("modulePermissionId") REFERENCES "ModulePermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_modulePermissionId_fkey" FOREIGN KEY ("modulePermissionId") REFERENCES "ModulePermission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_typePersonId_fkey" FOREIGN KEY ("typePersonId") REFERENCES "TypePerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOf" ADD CONSTRAINT "PersonOf_inChargeId_fkey" FOREIGN KEY ("inChargeId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonOf" ADD CONSTRAINT "PersonOf_assignedId_fkey" FOREIGN KEY ("assignedId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
