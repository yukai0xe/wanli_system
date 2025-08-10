'use client'
import styles from "@/assets/styles/components/timeline.module.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface TimelineItem {
  id: number;
  date: string;
  title: string;
  label: string;
  labelClassName: string;
  body: React.ReactNode;
}

interface MoreTimeLineItem {
  link?: string,
  moreAction: boolean
}

interface TimelineProps {
  items: (TimelineItem & MoreTimeLineItem)[];
}

interface Event {
  id: number;
  label: string;
  content: string[];
  click: boolean;
  showLabel: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const [events, setEvents] = useState<Event[]>(
    items.map((item) => ({
      id: item.id,
      label: item.label,
      content: [],
      click: true,
      showLabel: false,
    }))
  );

  const toggleClick = (id: number) => {
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
  };

  const router = useRouter();
  const pathname = usePathname();

  const routerTo = (link?: string) => {
    router.push(`${pathname}/${link}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        {items.map((item) => (
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
                  <span className={item.labelClassName}>
                    <time dateTime={item.date}>{item.title}</time>
                  </span>
                  <button disabled={!item.moreAction} onClick={() => routerTo(item.link)} className={styles.button}>準備文件</button>
                </div>
                <div className={styles.cardBody}>{item.body}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
