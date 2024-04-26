"use client";

const getWeekDates = (selectedDate: Date) => {
  const newDate: Date = selectedDate;
  const week: string[] = new Array();

  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    day: "numeric",
  };

  // Starting Monday not Sunday
  if (newDate.toLocaleDateString("en-EN", { weekday: "short" }) === "Sun") newDate.setDate(newDate.getDate() - 6);
  else newDate.setDate(newDate.getDate() - newDate.getDay() + 1);

  for (var i = 0; i < 7; i++) {
    week.push(new Date(newDate).toLocaleDateString(undefined, options));
    newDate.setDate(newDate.getDate() + 1);
  }

  return week;
};

export default getWeekDates;
