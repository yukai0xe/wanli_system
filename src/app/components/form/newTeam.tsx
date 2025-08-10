import styles from "@/assets/styles/dashboardLayout.module.css";
import { useDraftTeamStore } from "@/state/planTeamStore";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { inputModel } from "@/lib/viewModel/newTeam";
import RadioStyles from "@/assets/styles/components/radio.module.css";
import InputStyles from "@/assets/styles/components/input.module.css";
import SelectStyles from "@/assets/styles/components/select.module.css";
import React from "react";
import { DateType } from "@/types/enum";
import { parseEnumKey } from "@/lib/utility";

export const AddNewTeamComponent = ({
  cancel,
  submit
}: {
  cancel: () => void;
  submit: () => void;
}) => {
  
  const { team, setTeam } = useDraftTeamStore();

  const handleMember = ({roleLabel, name, phone}: {roleLabel: string, name?: string, phone?: string}) => {
    const updatedMembers = [...team.members];
    const idx = updatedMembers.findIndex((m) => m.role === roleLabel);

    if (idx !== -1) {
      if (typeof name === "string")
        updatedMembers[idx] = { ...updatedMembers[idx], name };
      if (typeof phone === "string")
        updatedMembers[idx] = { ...updatedMembers[idx], phone };
    }
    else {
      updatedMembers.push({
        name: name || "",
        role: roleLabel,
        phone: phone || "",
        IDNumber: "",
        studentNumber: "",
      });
    }

    setTeam({ members: updatedMembers });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form className={styles.basciForm} onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-base/7 font-semibold text-gray-900">
            你要去哪裡
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            請填寫以下資料，除了隊伍名稱必填，其他留空也可以，資料新增後仍可修改
          </p>
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="mainName"
            className="block text-sm/6 font-medium text-gray-900"
          >
            活動名稱
          </label>
          <p className="mt-3 text-sm/6 text-gray-600">
            你這次活動的名稱，如：南湖大山四天三夜、戒茂斯上嘉明湖、唐麻丹下蝴蝶谷
          </p>
          <div className="mt-2">
            <input
              id="mainName"
              name="mainName"
              type="text"
              className={InputStyles.customInput}
              placeholder="輸入活動名稱"
              value={team.mainName}
              onChange={(e) => setTeam({ mainName: e.target.value })}
            />
          </div>
        </div>
        <div className="col-span-full border-b border-gray-900/10 pb-12">
          <label
            htmlFor="description"
            className="block text-sm/6 font-medium text-gray-900"
          >
            活動介紹
          </label>
          <p className="mt-3 text-sm/6 text-gray-600">
            介紹這次隊伍，比如有什麼景點、有什麼活動、建議事項、想要招募的類型，心靈喊話也可以
          </p>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              className={InputStyles.customInput}
              placeholder="輸入活動介紹"
              value={team.mainDescription}
              onChange={(e) => setTeam({ mainDescription: e.target.value })}
            />
          </div>
        </div>
        <div className="sm:col-span-3 border-b border-gray-900/10 pb-12">
          <label className="text-sm/6 text-gray-900">活動性質</label>
          <div className="mt-6 flex space-x-6">
            {inputModel.teamTye.map((item, idx) => {
              const prevType =
                idx > 0 ? inputModel.teamTye[idx - 1].type : null;
              const showSlash = prevType !== null && prevType !== item.type;

              return (
                <React.Fragment key={item.id}>
                  {showSlash && (
                    <span className="mx-2 text-gray-500 select-none self-center">
                      /
                    </span>
                  )}
                  <div className="flex items-center gap-x-3">
                    <input
                      id={item.dataName?.toLocaleLowerCase()}
                      name={item.type}
                      type="radio"
                      className={RadioStyles.customRadio}
                      value={item.label}
                      checked={
                        item.type === "teamCategory"
                          ? item.dataName === team.type[0]
                          : item.dataName === team.type[1]
                      }
                      onChange={() => {
                        if (item.type === "teamCategory")
                          setTeam({
                            type: [item.dataName, team.type[1]],
                          });
                        if (item.type === "teamActivity")
                          setTeam({
                            type: [team.type[0], item.dataName],
                          });
                      }}
                    />
                    <label
                      htmlFor={item.dataName?.toLocaleLowerCase()}
                      className="block text-sm font-medium text-gray-900 cursor-pointer select-none"
                    >
                      {item.label}
                    </label>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="sm:col-span-3">
          <label
            htmlFor="day-type"
            className="block text-sm/6 font-medium text-gray-900"
          >
            活動期間
          </label>
          <div className="mt-2 grid grid-cols-1">
            <select
              id="day-type"
              name="day-type"
              autoComplete="day-type-name"
              className={SelectStyles.customSelect}
              value={DateType[team.dateType as keyof typeof DateType]}
              onChange={(e) => {
                setTeam({
                  dateType: parseEnumKey(DateType, e.currentTarget.value),
                  startDate: "",
                  endDate: "",
                });
              }}
            >
              {Object.entries(DateType).map(([key, value]) => (
                <option key={key}>{ value }</option>
              ))}
            </select>
          </div>

          {team.dateType === parseEnumKey(DateType, DateType.OneDay) ? (
            <div className="sm:col-span-3 mt-5">
              <label
                htmlFor="one-day"
                className="block text-sm/6 font-medium text-gray-900"
              >
                出發日期/結束日期
              </label>
              <div className="mt-2">
                <input
                  id="one-day"
                  name="one-day"
                  type="date"
                  autoComplete="family-name"
                  className={InputStyles.customInput}
                  defaultValue={
                    team.startDate
                      ? dayjs(team.startDate).format("YYYY-MM-DD")
                      : ""
                  }
                  placeholder="輸入當日來回日期"
                  onChange={(e) =>
                    setTeam({
                      startDate: e.currentTarget.value
                        ? new Date(e.currentTarget.value)
                        : "",
                      endDate: e.currentTarget.value
                        ? new Date(e.currentTarget.value)
                        : "",
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="more-day-start"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  出發日期
                </label>
                <div className="mt-2">
                  <input
                    id="more-day-start"
                    name="more-day-start"
                    type="date"
                    className={InputStyles.customInput}
                    defaultValue={
                      team.startDate
                        ? dayjs(team.startDate).format("YYYY-MM-DD")
                        : ""
                    }
                    placeholder="輸入出發日期"
                    onChange={(e) =>
                      setTeam({
                        startDate: e.currentTarget.value
                          ? new Date(e.currentTarget.value)
                          : "",
                      })
                    }
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="more-day-end"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  結束日期
                </label>
                <div className="mt-2">
                  <input
                    id="more-day-end"
                    name="more-day-end"
                    type="date"
                    className={InputStyles.customInput}
                    defaultValue={
                      team.endDate
                        ? dayjs(team.endDate).format("YYYY-MM-DD")
                        : ""
                    }
                    placeholder="輸入結束日期"
                    onChange={(e) =>
                      setTeam({
                        endDate: e.currentTarget.value
                          ? new Date(e.currentTarget.value)
                          : "",
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sm:col-span-3 border-b border-gray-900/10 pb-12">
          <label
            htmlFor="prepare-day"
            className="block text-sm/6 font-medium text-gray-900"
          >
            預備天
          </label>
          <div className="mt-2">
            <input
              id="prepare-day"
              name="prepare-day"
              type="number"
              min={0}
              className={InputStyles.customInput}
              value={team.prepareDate}
              onChange={(e) =>
                setTeam({ prepareDate: Number(e.currentTarget.value) })
              }
            />
          </div>
        </div>
        <div className="sm:col-span-3 border-b border-gray-900/10 pb-12">
          <label
            htmlFor="first-name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            預計人數
          </label>
          <p className="mt-3 text-sm/6 text-gray-600">
            包含隨隊幹部、領隊、嚮導的人數
          </p>
          <div className="mt-2">
            <input
              id="expectedTeamSize"
              name="expectedTeamSize"
              type="number"
              className={InputStyles.customInput}
              value={Number(team.expectedTeamSize)}
              onChange={(e) =>
                setTeam({
                  expectedTeamSize: Number(e.currentTarget.value),
                })
              }
            />
          </div>
        </div>
        <div className="sm:col-span-3 border-b border-gray-900/10 pb-12">
          <label className="text-sm/6 text-gray-900">交通方式</label>
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {inputModel.transportType.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-5 h-5">
                    <input
                      type="checkbox"
                      id={item.dataName}
                      name="transport"
                      className="peer absolute inset-0 w-full h-full appearance-none rounded-sm border border-gray-300 bg-white cursor-pointer
                                checked:bg-indigo-600 checked:border-indigo-600"
                      value={item.label}
                      checked={team.transportType.includes(item.label)}
                      onChange={(e) => {
                        setTeam({
                          transportType: e.target.checked
                            ? [...team.transportType, item.label]
                            : team.transportType.filter(
                                (x) => x !== item.label
                              ),
                        });
                      }}
                    />
                    <div
                      className="pointer-events-none absolute top-[20%] left-1 w-2 h-3 border-r-2 border-b-2 border-white
                 rotate-45 scale-0 peer-checked:scale-100 origin-bottom-left transition-transform -translate-y-1/2"
                    ></div>
                  </div>
                  <label
                    htmlFor={item.dataName}
                    className="font-medium text-gray-900 cursor-pointer select-none"
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">重要職位</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            開隊最主要的各職位負責人，如：領隊、嚮導、留守
          </p>

          {inputModel.role.map((role) => (
            <div
              key={role.id}
              className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
            >
              <div className="sm:col-span-3">
                <label
                  htmlFor={role.dataName?.toLocaleLowerCase()}
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  {role.label}
                </label>
                <div className="mt-2">
                  <input
                    id={role.dataName?.toLocaleLowerCase()}
                    name={role.dataName?.toLocaleLowerCase()}
                    type="text"
                    value={
                      team.members.find((m) => m.role === role.dataName)?.name ||
                      ""
                    }
                    className={InputStyles.customInput}
                    placeholder="輸入負責人姓名"
                    onChange={(e) =>
                      handleMember({
                        roleLabel: role.dataName ?? "",
                        name: e.currentTarget.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor={`${role.dataName?.toLocaleLowerCase()}-phone`}
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  聯絡電話
                </label>
                <div className="mt-2">
                  <input
                    id={`${role.dataName?.toLocaleLowerCase()}-phone`}
                    name={`${role.dataName?.toLocaleLowerCase()}-phone`}
                    type="tel"
                    pattern="[0-9]{10}"
                    className={InputStyles.customInput}
                    value={
                      team.members.find((m) => m.role === role.dataName)?.phone ||
                      ""
                    }
                    placeholder="輸入負責人常用電話"
                    onChange={(e) =>
                      handleMember({
                        roleLabel: role.dataName ?? "",
                        phone: e.currentTarget.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm/6 text-gray-900"
          onClick={() => cancel()}
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          新增
        </button>
      </div>
    </form>
  );
};


export const AnimatedAddNewTeam = ({ cancel, submit }: {
  cancel: () => void;
  submit: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={`transform transition-transform duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <AddNewTeamComponent cancel={cancel} submit={submit} />
    </div>
  );
};