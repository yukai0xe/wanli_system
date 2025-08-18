export enum TeamRole {
  Leader = "領隊",
  Guide = "嚮導",
  StayBehind = "留守",
  ClubExec = "隨隊幹部",
  NormalMember = "一般隊員"
}

export enum Gender {
    Male = "男",
    Female = "女"
}

export enum DateType {
  OneDay = "當日往返",
  MoreDay = "過夜"
}

export enum TeamCategory {
  General = "一般",
  Technical = "技術"
}

export enum TeamActivityType {
  Official = "正式活動",
  Private = "私下活動",
  Exploration = "探勘"
}

export enum EventState {
  NotStart = "仍未開始",
  InProgress = "處理中",
  Done = "完成囉",
  Check = "輸出檔案了"
}

export enum ItemCheckState {
  No = "從未確認過",
  FirstCheck = "有初檢了",
  SecondCheck = "有複檢了",
  Ok = "裝備檢查通過"
}

export enum Event {
  firstMeetingState = "行前會",
  firstCheckItemState = "裝備初檢",
  secondCheckItemState = "裝備複檢",
  runForSchoolState = "跑公文",
  finalCheckState = "審留守"
}

export enum finalPlanType {
  teamMemberList = "隊員名單",
  personalItemList = "個人裝備表",
  teamItemList = "團隊裝備表",
  supply = "糧單",
  route = "預計行程/參考行程",
  BPlan = "撤退計畫/拆隊計畫",
  map = "航跡圖",
  other = "其他(水源、訊號、急救站、交通)"
}

export enum FileType {
  firstMeeting = "行前會"
}