export interface dashboardPerson {
  zone: { name: string; count: number }[];
  department: { department: string; school: number; teacher: number }[];
  career: { career: string; count: number }[];
  sex: { sex: string; count: number }[];
  nip: number;
  ages: {
    range: string;
    quantity: number;
  }[];
  total: {
    school: number;
    teacher: number;
  };
}
