
declare global {
  interface Member {
    id: string;
    name: string;
    role: TeamRole;
    phone: string;
    address?: string;
    email?: string;
    birth?: Date;
    IDNumber: string;
    gender?: Gender;
    department?: string;
    studentNumber: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  }

  interface DraftTeamMemberState {
    member: Member;
    setMember: (member: Partial<Member>) => void;
    resetMember: () => void;
  }
}

export {}

