
declare global {
  interface Member {
    id?: number;
    name: string;
    role: TeamRole;
    phone: string;
    address?: string | null;
    email?: string | null;
    birth?: Date;
    IDNumber: string;
    gender?: Gender;
    department?: string;
    studentNumber: string;
  }
}

export {}

