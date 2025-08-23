import { ItemCheckState, ItemType } from "./enum";

declare global {

  interface Item {
    id: string;
    name: string;
    description: string;
    type: ItemType;
    weight?: number;
    required?: boolean;
    quantity?: string;
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
