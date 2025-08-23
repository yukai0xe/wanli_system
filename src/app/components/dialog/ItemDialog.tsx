import { ItemColumn, PersonalItemType, TeamItemType } from "@/types/enum";
import DialogComponent from ".";
import InputComponent from "@/app/components/form/input";
import { useState } from "react";

const AddNewItem: React.FC<{
  open: boolean;
  isTeam: boolean;  
  handleClose: () => void;
  handleConfirm: () => void;
}> = ({ open, isTeam, handleClose, handleConfirm }) => {
    const [addDescription, setAddDescription] = useState<boolean>(false);
    return (
      <DialogComponent
        title="新增裝備"
        open={open}
        handleClose={() => {
          handleClose();
        }}
        handleConfirm={() => {
          handleConfirm();
          handleClose();
        }}
        button={{
          cancel: "取消",
          confirm: "新增",
        }}
      >
        <InputComponent
          direction
          label={ItemColumn.name}
          input={{ type: "text" }}
          placeholder={`輸入${ItemColumn.name}`}
          inputChangeHandler={(v: string) => {
            console.log(v);
          }}
        />
        {Object.entries(ItemColumn).map(([, value], idx) => {
          switch (value) {
            case ItemColumn.type:
              return (
                <InputComponent
                  direction
                  key={idx}
                  label={value}
                  input={{
                    type: "select",
                    value: Object.entries(
                      isTeam ? TeamItemType : PersonalItemType
                    ).map(([key, value]) => {
                      return {
                        label: value,
                        value: key,
                      };
                    }),
                  }}
                  inputChangeHandler={(v: string) => {
                    console.log(v);
                  }}
                />
              );
            case ItemColumn.required:
              return (
                !isTeam && (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    input={{ type: "checkbox" }}
                    inputChangeHandler={(v: string) => {
                      console.log(v);
                    }}
                  />
                )
              );

            case ItemColumn.quantity:
            case ItemColumn.weight:
              return (
                isTeam && (
                  <InputComponent
                    direction
                    key={idx}
                    label={value}
                    placeholder={`輸入${value}${value === ItemColumn.weight ? "(g)" : ""}`}
                    input={{ type: "number" }}
                    inputChangeHandler={(v: string) => {
                      console.log(v);
                    }}
                  />
                )
              );
          }
        })}
        {!addDescription ? (
        <div className="mt-2 flex gap-x-3 items-center justify-between text-sm/6 font-medium text-gray-900">
            <label>{ItemColumn.description}</label>
                <button
                    className="px-3 py-1 rounded bg-amber-500 text-gray-800 hover:bg-amber-600"
                    onClick={() => setAddDescription(true)}
                >
                    增加敘述
                </button>
            </div>
        ) : (
            <div className="mt-2 flex flex-col gap-y-2 text-sm/6 font-medium text-gray-900">
                <label>{ItemColumn.description}</label>
                <textarea className="p-3" rows={10} placeholder={ItemColumn.description} />
            </div>
        )}
      </DialogComponent>
    );
    }

export { AddNewItem }