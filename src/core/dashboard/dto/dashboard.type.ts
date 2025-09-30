export interface IGroupCount {
  label: string;
  count: number;
}
export interface DashboardPerson {
  zone: IGroupCount[];
  department: { department: string; school: number; teacher: number }[];
  career: IGroupCount[];
  sex: IGroupCount[];
  nip: number;
  ages: IGroupCount[];
  experience: IGroupCount[];
  educationalLevel: IGroupCount[];
  totalTeacher: ITeacherStatus;
}

export interface DashboardAttendance {
  eventType: IGroupCount[];
  mentoring: IGroupCount[];
  events: IEventType[];
}

export interface IEventType {
  totalEvents: number;
  name: string;
  Event: {
    name: string;
  }[];
}

export interface ITeacherStatus {
  inactive: number;
  active: number;
}

export interface IAppendix8 {
  dimension: string;
  answers: {
    time: number;
    labels: IGroupCount[];
  }[];
}

export interface DashboardMentoring {
  appendix8: IAppendix8[];
}
