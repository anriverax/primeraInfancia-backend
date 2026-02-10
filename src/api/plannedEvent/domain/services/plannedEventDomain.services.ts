import { Injectable } from "@nestjs/common";
import {
  IPlannedEvent,
  IPlannedEventDetailResponse,
  IPlannedEventListResponse,
  ITeacher,
  ITeacherListWithSchool,
  ITeacherListWithSchoolV2
} from "../../application/dto/plannedEvent.type";
import { formatForFrontend, getRecordStatus } from "@/common/helpers/functions";

@Injectable()
export class PlannedEventDomainService {
  formattedTeachers(teachers: ITeacher[]): ITeacherListWithSchool[] {
    const activeTeachers = teachers.filter((t: ITeacher) => t.deletedAt === null);
    const newformatted = activeTeachers
      .map((t: ITeacher) => ({
        id: t.id,
        fullName: `${t.Person.firstName} ${t.Person.lastName1} ${t.Person.lastName2}`,
        School: {
          code: t.School.code,
          name: t.School.name
        }
      }))
      .filter((t) => t !== null)
      .sort((a, b) => a!.fullName.localeCompare(b!.fullName));

    return newformatted;
  }

  formatPlannedEventTeachers(
    withTeacher: boolean,
    plannedEvent: IPlannedEventDetailResponse[]
  ): ITeacherListWithSchoolV2[] | number[] {
    if (plannedEvent.length > 0) {
      const activePlannedEventTeachers = plannedEvent.filter((pet) => pet.deletedAt === null);

      if (withTeacher) {
        const newformattedTeachers = activePlannedEventTeachers.map((pet) => ({
          plannedEventTeacherId: pet.id,
          personId: pet.Teacher.Person.id,
          id: pet.Teacher.id,
          fullName: `${pet.Teacher.Person.firstName} ${pet.Teacher.Person.lastName1} ${pet.Teacher.Person.lastName2}`,
          phoneNumber: pet.Teacher.Person.phoneNumber,
          email: pet.Teacher.Person.User?.email,
          School: {
            code: pet.Teacher.School.code,
            name: pet.Teacher.School.name
          },
          status: getRecordStatus(pet.Teacher.deletedAt)
        }));

        return newformattedTeachers;
      }

      const teachersId = activePlannedEventTeachers.map((pet) => pet.Teacher.id);

      return teachersId;
    }

    return [];
  }

  formattedPlannedEvents(withTeacher: boolean, plannedEvent: IPlannedEventListResponse): IPlannedEvent {
    let limitCount: number = 0;
    const eventName = plannedEvent.EventInstance.Event.name;

    const formattedTeachers = this.formatPlannedEventTeachers(
      withTeacher,
      plannedEvent.PlannedEventTeachers
    );

    if (eventName.includes("individual")) {
      limitCount = 1;
    } else if (eventName.includes("pareja")) {
      limitCount = 2;
    } else {
      limitCount = 3;
    }

    return {
      id: plannedEvent.id,
      module: {
        id: plannedEvent.TrainingModule.id,
        name: plannedEvent.TrainingModule.name
      },
      eventInstance: { id: plannedEvent.EventInstance.id, name: plannedEvent.EventInstance.Event.name },
      limitCount,
      description: plannedEvent.description,
      start: formatForFrontend(plannedEvent.start),
      teachers: formattedTeachers
    };
  }
}
