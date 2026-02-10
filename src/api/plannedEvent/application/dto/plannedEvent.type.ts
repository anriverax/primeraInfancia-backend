import { RecordStatus } from "@/common/helpers/const";
import { IPagination } from "@/common/helpers/types";
import { PlannedEvent, PlannedEventTeacher } from "prisma/generated/client";

export type IPlannedEventData = Pick<
  PlannedEvent,
  "eventInstanceId" | "trainingModuleId" | "start" | "description"
>;

export type IPlannedEventTeacherData = Pick<PlannedEventTeacher, "plannedEventId"> & {
  teacherIds: number[];
};

export interface IPlannedEventList extends Pick<PlannedEvent, "id"> {
  title: string;
  start: string;
  extendedProps: {
    trainingModule: string;
  };
  color: string;
  isHideButton: boolean;
}

export interface IPlannedEventPagination {
  data: IPlannedEventList[];
  meta: IPagination;
}

export interface ITeacherListWithSchool {
  id: number;
  fullName: string;
  School: {
    code: string;
    name: string;
  };
}

export interface ITeacherListWithSchoolV2 extends ITeacherListWithSchool {
  plannedEventTeacherId: number;
  personId: number;
  phoneNumber: string | null;
  email: string | undefined;
  status: RecordStatus;
}

export interface ITeacher {
  id: number;
  deletedAt: Date | null;
  School: {
    code: string;
    name: string;
  };
  Person: {
    id: number;
    firstName: string;
    lastName1: string;
    lastName2: string;
    phoneNumber: string;
    deletedAt: Date | null;
    User?: {
      email: string;
    };
  };
}

export interface IPlannedEventListResponse {
  id: number;
  start: Date;
  description: string;
  TrainingModule: {
    id: number;
    name: string;
  };
  EventInstance: {
    id: number;
    Person: {
      id: number;
      fullName: string;
    };
    Event: {
      id: number;
      name: string;
    };
  };
  PlannedEventTeachers: {
    id: number;
    deletedAt: Date | null;
    Teacher: ITeacher;
  }[];
}

export interface IPlannedEventDetailResponse {
  id: number;
  deletedAt: Date | null;
  Teacher: ITeacher;
}

export interface IPlannedEvent {
  id: number;
  module: {
    id: number;
    name: string;
  };
  eventInstance: {
    id: number;
    name: string;
  };
  limitCount: number;
  description: string | null;
  start: string;
  teachers: ITeacherListWithSchoolV2[] | number[];
}
