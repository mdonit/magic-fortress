"use client";

import React, { useState } from "react";
import Flatpickr from "react-flatpickr";
// import { Hungarian } from "flatpickr/dist/l10n/hu.js";
import getWeekDates from "@lib/getWeekDates";
import "flatpickr/dist/flatpickr.css";

type ChangeGameDate = {
  changeGameDate: (changedDates: string[]) => void;
  currentDayFormat: string;
};

const Calendar = ({ changeGameDate, currentDayFormat }: ChangeGameDate) => {
  const [selectedDate, setSelectedDate] = useState<string>(currentDayFormat);

  const pickDates = (year: number, month: number, day: number) => {
    const pickedDate: Date = new Date();
    pickedDate.setFullYear(year, month, day);
    const datesArray: string[] = getWeekDates(pickedDate);

    changeGameDate(datesArray);
  };

  return (
    <div className="flex flex-col">
      <Flatpickr value={selectedDate} options={{ locale: { firstDayOfWeek: 1 }, enableTime: false }} onChange={(e) => pickDates(e[0].getFullYear(), e[0].getMonth(), e[0].getDate())} />
    </div>
  );
};

export default Calendar;
