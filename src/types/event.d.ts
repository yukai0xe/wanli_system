import { EventState } from "./enum";

declare global {
  type EventStateDict = {
    firstMeetingState: EventState;
    firstCheckItemState: EventState;
    secondCheckItemState: EventState;
    finalCheckState: EventState;
  } & Record<string, EventState>;
}

export { };
