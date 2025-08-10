'use client';
import { Timeline } from "@/app/components/timeline";

const timelineData = [
  {
    id: 1,
    date: "2020-07-08",
    title: "July 8",
    label: "行前會",
    labelClassName: "uk-label-success",
    moreAction: true,
    link: "/firstMeeting",
    body: <ul></ul>,
  },
  {
    id: 2,
    date: "2020-07-07",
    title: "July 7",
    label: "裝備初檢",
    labelClassName: "uk-label-warning",
    moreAction: true,
    link: "checkItems",
    body: <ul></ul>,
  },
  {
    id: 3,
    date: "2020-07-06",
    title: "July 6",
    label: "裝備複檢",
    labelClassName: "uk-label-danger",
    link: "checkItems",
    moreAction: true,
    body: <ul></ul>,
  },
  {
    id: 4,
    date: "2020-07-06",
    title: "July 6",
    label: "跑公文",
    moreAction: false,
    labelClassName: "uk-label-danger",
    body: <ul></ul>,
  },
  {
    id: 5,
    date: "2020-07-06",
    title: "July 6",
    label: "審留守",
    moreAction: true,
    labelClassName: "uk-label-danger",
    link: "finalCheck",
    body: <ul></ul>,
  },
];

const PlanTeamPage = () => {
    return (
        <Timeline items={timelineData} />
    );
}

export default PlanTeamPage;
