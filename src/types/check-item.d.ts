import { ItemCheckState } from "./enum";

declare global {
  interface Item {
    name: string;
    description: string;
  }

  interface MemberItem extends Item {
    own: boolean;
    remark: string;
  }

  type MemberRemarks = string[];

  interface MemberCheckState {
    state: ItemCheckState;
    remarks: MemberRemarks;
    items: MemberItem[];
  }

  interface CheckItem {
    members: Member[];
    memberStates: Record<number, MemberCheckState>;
  }
}

export { };
