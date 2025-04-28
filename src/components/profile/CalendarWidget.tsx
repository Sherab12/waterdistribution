"use client";

import { useState } from "react";
import { Calendar } from "react-calendar";
import { Value } from "react-calendar/dist/cjs/shared/types";
import 'react-calendar/dist/Calendar.css';

export default function CalendarWidget() {
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Calendar</h3>
      <Calendar onChange={setCalendarDate} value={calendarDate} />
    </div>
  );
}
