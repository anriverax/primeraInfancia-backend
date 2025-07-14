// import { Injectable } from "@nestjs/common";
// // import { Person } from "@prisma/client";

// import { PrismaService } from "@/services/prisma/prisma.service";
// // import { ICreatePerson, IDeletePerson, IUpdatePerson } from "../../dto/person.type";
// // import { handlePrismaError } from "@/common/helpers/functions";

// @Injectable()
// export class PersonProjection {
//   constructor(private prisma: PrismaService) {}

//   // async create(data: ICreatePerson): Promise<Person> {
//   //   try {
//   //     return await this.prisma.person.create({ data: { ...data } });
//   //   } catch (error) {
//   //     handlePrismaError("PersonProjection", error);
//   //   }
//   // }

//   // async update(data: IUpdatePerson): Promise<Person> {
//   //   const {
//   //     id,
//   //     firstname,
//   //     lastname1,
//   //     lastname2,
//   //     dui,
//   //     address,
//   //     gender,
//   //     phoneNumber,
//   //     birthdate,
//   //     duiImage,
//   //     districtId,
//   //     isActive,
//   //     typePersonId,
//   //     updatedBy
//   //   } = data;

//   //   try {
//   //     return await this.prisma.person.update({
//   //       where: { id },
//   //       data: {
//   //         firstname,
//   //         lastname1,
//   //         lastname2,
//   //         dui,
//   //         address,
//   //         gender,
//   //         phoneNumber,
//   //         birthdate,
//   //         duiImage,
//   //         districtId,
//   //         isActive,
//   //         typePersonId,
//   //         updatedBy
//   //       }
//   //     });
//   //   } catch (error) {
//   //     handlePrismaError("PersonProjection", error);
//   //   }
//   // }

//   // async delete(data: IDeletePerson): Promise<Person> {
//   //   const { id, deletedBy } = data;

//   //   try {
//   //     return await this.prisma.softDelete("person", { id }, { deletedBy });
//   //   } catch (error) {
//   //     handlePrismaError("PersonProjection", error);
//   //   }
//   // }
// }
