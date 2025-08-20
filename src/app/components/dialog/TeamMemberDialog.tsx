import { MemberColumn, TeamRole, Gender } from "@/types/enum";
import DialogComponent from ".";
import InputComponent from "@/app/components/form/input";
import { useDraftTeamMemberStore } from "@/state/teamMemberStore";

const AddNewTeamMember: React.FC<{
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}> = ({ open, handleClose, handleConfirm }) => {
    const { member, setMember, resetMember } = useDraftTeamMemberStore();

    return (
        <DialogComponent
            title="新增隊伍成員"
            open={open}
            handleClose={() => {
                handleClose();
                resetMember();
            }}
            handleConfirm={() => {
                handleConfirm();
                handleClose();
                resetMember();
            }}
            button={{
                cancel: "取消",
                confirm: "新增",
            }}
        >
        {Object.entries(MemberColumn).map(([key, value], idx) => {
            switch (value) {
            case MemberColumn.isLeader:
                return (
                  <InputComponent
                    direction
                    key={idx}
                    label="隊伍角色"
                    value={member.role}
                    input={{
                      type: "select",
                        value: Object.entries(TeamRole).map(([key, value]) => {
                            return {
                                label: value,
                                value: key,
                            };
                        }),
                    }}
                    inputChangeHandler={(v: string) => setMember({ role: v })}
                  />
                );
            case MemberColumn.gender:
                return (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    value={member.gender}
                    input={{
                      type: "select",
                      value: Object.entries(Gender).map(([key, value]) => {
                        return {
                          label: value,
                          value: key,
                        };
                      }),
                    }}
                    inputChangeHandler={(v: string) => setMember({ [key]: v })}
                  />
                );
            case MemberColumn.birth:
                return (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    value={member.birth?.toLocaleString() || ""}
                    input={{ type: "date" }}
                    inputChangeHandler={(v: string) => setMember({ [key]: v })}
                  />
                );
            default:
                return (
                <InputComponent
                    direction
                    key={idx}
                    label={value}
                    value={
                    key in member ? member[key as keyof Member] : ""
                    }
                    placeholder={`輸入${value}`}
                    input={{ type: "text" }}
                    inputChangeHandler={(v: string) => setMember({ [key]: v })}
                />
                );
            }
        })}
        </DialogComponent>
  );
};

export { AddNewTeamMember }