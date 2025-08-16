'use client'
import styles from "@/assets/styles/components/timeline.module.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import InputComponent from "@/app/components/form/input";
import { Button1 } from "@/app/components/button";
import DialogComponent from "@/app/components/dialog";
import { useState } from "react";

export interface TimelineItem {
  id: number;
  date: string;
  title: string;
  label: string;
  labelClassName: string;
  buttonLabel: string;
  body: {
    text: string
  }[]
}

export interface MoreTimeLineItem {
  link?: string,
  moreAction: boolean
}

interface TimelineProps {
  items: (TimelineItem & MoreTimeLineItem)[];
}

interface Event {
  click: boolean;
  showLabel: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [events, setEvents] = useState<
    (TimelineItem & MoreTimeLineItem & Event)[]
  >(
    items.map((item) => ({
      ...item,
      click: item.moreAction,
      showLabel: !item.moreAction,
    }))
  );

  const [settingState, setSettingState] = useState<{label: boolean, content: boolean}>({
    label: true,
    content: false
  });

  const [addNewEvent, setAddNewEvent] = useState<boolean>(false);
  const [newEvent, setNewEvent] = useState<TimelineItem & MoreTimeLineItem>({
    id: 0,
    date: "",
    title: "",
    label: "",
    labelClassName: "",
    buttonLabel: "",
    body: [{ text: "" }],
    moreAction: false
  });

  const toggleClick = (id: number | boolean) => {
    if (typeof id === "boolean") {
      setAddNewEvent(false);
      setSettingState({
        label: false,
        content: false,
      });
      setTimeout(() => {
        setSettingState({
          label: !id,
          content: id,
        });
      }, id ? 100 : 1000);
      return;   
    }
    if (typeof id === "number") {
        setEvents((prev) =>
          prev.map((event) => {
            if (event.id === id) {
              const isOpening = !event.click;

              if (!isOpening) {
                setTimeout(() => {
                  setEvents((prev2) =>
                    prev2.map((ev) =>
                      ev.id === id ? { ...ev, showLabel: true } : ev
                    )
                  );
                }, 100);
              } else {
                return { ...event, click: true, showLabel: false };
              }

              return { ...event, click: !event.click, showLabel: false };
            }
            return event;
          })
        );
    }
  };

  const router = useRouter();
  const pathname = usePathname();

  const routerTo = (link?: string) => {
    router.push(`${pathname}/${link}`);
  }

  const addNewEventHandler = () => {
    setEvents([
      ...events,
      {
        ...newEvent,
        id: events.length + 1,
        click: newEvent.moreAction,
        showLabel: !newEvent.moreAction
      },
    ]);
    setAddNewEvent(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        <div className={`${styles.timelineItem}`}>
          <div
            className={`${styles.timelineIcon} ${
              settingState.label && styles.active
            }`}
            onClick={() => {
              toggleClick(settingState.label);
            }}
          >
            <Image
              src="/calendar-day.svg"
              alt="icon"
              width={30}
              height={30}
              style={{ filter: "invert(1)" }}
            />
          </div>
          {settingState.label && (
            <div className={styles.miniLabel}>安排事件設定</div>
          )}
          <div
            className={`${styles.timelineContentVertical} ${
              settingState.content && styles.show
            }`}
          >
            <div>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>設定所有事件時間</h3>
              </div>
              <div className={styles.cardBody}>
                {events.map((item) => (
                  <InputComponent
                    key={item.id}
                    direction
                    item={{
                      id: "",
                      name: "",
                      type: "date",
                      placeholder: "輸入日期",
                      label: `${item.label} 日期`,
                      value: item.date,
                      inputChangeHandler: (v: string) => {
                        setEvents((prev) =>
                          prev.map((i) =>
                            i.id === item.id ? { ...i, date: v } : i
                          )
                        );
                      },
                    }}
                  />
                ))}
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8">
                  <Button1
                    name="新增時間"
                    animate={false}
                    style={{ color: "var(--white-2)", padding: "5px", gap: 0 }}
                    handleClick={() => setAddNewEvent(true)}
                  />
                </div>
                {addNewEvent && (
                  <DialogComponent
                    title="安排新事件"
                    open={addNewEvent}
                    button={{
                      cancel: "取 消",
                      confirm: "新 增",
                    }}
                    handleClose={() => setAddNewEvent(false)}
                    handleConfirm={() => addNewEventHandler()}
                  >
                    <InputComponent
                      direction
                      item={{
                        type: "text",
                        label: "安排事件名稱",
                        placeholder: "輸入名稱",
                        inputChangeHandler: (v: string) => {
                          setNewEvent({ ...newEvent, label: v });
                        },
                      }}
                    />
                    <InputComponent
                      direction
                      item={{
                        type: "date",
                        label: "安排事件日期",
                        inputChangeHandler: () => (v: string) => {
                          setNewEvent({ ...newEvent, date: v });
                        },
                      }}
                    />
                  </DialogComponent>
                )}
              </div>
            </div>
          </div>
        </div>
        {events.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            <div
              className={`${styles.timelineIcon} ${
                !events.find((event) => event.id === item.id)?.click &&
                styles.active
              }`}
              onClick={() => toggleClick(item.id)}
            >
              <Image
                src="/bulb.svg"
                alt="icon"
                width={30}
                height={30}
                style={{ filter: "invert(1)" }}
              />
            </div>
            {events.find((event) => event.id === item.id)?.showLabel && (
              <div className={styles.miniLabel}>{item.label}</div>
            )}
            <div
              className={`${styles.timelineContent} ${
                events.find((event) => event.id === item.id)?.click &&
                styles.show
              }`}
            >
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{item.label}</h3>
                  <span className={styles.timeTag}>
                    <time dateTime={item.date}>{item.date || item.title}</time>
                  </span>
                  {item.moreAction && (
                    <button
                      disabled={!item.moreAction}
                      onClick={() => routerTo(item.link)}
                      className={styles.button}
                    >
                      {item.buttonLabel}
                    </button>
                  )}
                </div>
                {item.moreAction && (
                  <div className={styles.cardBody}>
                    <ul>
                      {item.body &&
                        item.body.map((p, idx) => {
                          return <li key={idx}>{p.text}</li>;
                        })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
