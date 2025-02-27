import { formatDateKey } from "../utils/dateUtils";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const SAMPLE_SCHEDULE = {
  [formatDateKey(yesterday)]: [
    {
      id: 1,
      shift: "Ca sáng",
      time: "07:00 - 15:00",
      role: "Phục vụ",
      color: "#4D96FF",
    },
  ],
  [formatDateKey(today)]: [
    {
      id: 2,
      shift: "Ca chiều",
      time: "15:00 - 23:00",
      role: "Thu ngân",
      color: "#FF6B6B",
    },
  ],
  [formatDateKey(tomorrow)]: [
    {
      id: 3,
      shift: "Ca sáng",
      time: "07:00 - 15:00",
      role: "Phục vụ",
      color: "#4D96FF",
    },
  ],
  "2024-02-25": [
    {
      id: 1,
      shift: "Ca sáng",
      time: "07:00 - 15:00",
      role: "Phục vụ",
      color: "#4D96FF",
    },
  ],
  "2024-02-26": [
    {
      id: 2,
      shift: "Ca chiều",
      time: "15:00 - 23:00",
      role: "Thu ngân",
      color: "#FF6B6B",
    },
  ],
  "2024-02-28": [],
  "2024-02-29": [
    {
      id: 3,
      shift: "Ca sáng",
      time: "07:00 - 15:00",
      role: "Phục vụ",
      color: "#4D96FF",
    },
  ],
  "2024-03-01": [
    {
      id: 4,
      shift: "Ca chiều",
      time: "15:00 - 23:00",
      role: "Thu ngân",
      color: "#FF6B6B",
    },
  ],
  "2024-03-02": [],
  "2024-03-03": [
    {
      id: 5,
      shift: "Ca sáng",
      time: "07:00 - 15:00",
      role: "Phục vụ",
      color: "#4D96FF",
    },
  ],
};
