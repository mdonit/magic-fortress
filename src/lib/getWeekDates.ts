"use client";

const formatDate = (date: Date, dayOffest: number, options: Intl.DateTimeFormatOptions, isThisWeek: boolean) => {
  const formattedDate: string = isThisWeek
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + dayOffest).toLocaleDateString(undefined, options)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate() + (8 - date.getDay()) + dayOffest).toLocaleDateString(undefined, options);

  return formattedDate;
};

const getWeekDates = (selectedDate?: string) => {
  const thisYear = new Date().getFullYear();
  let today: number = 0;
  const options: Intl.DateTimeFormatOptions = {
    month: "numeric",
    day: "numeric",
  };
  const dateString: string = new Date().toLocaleDateString(undefined, options);
  let thisDate: Date = new Date(`${thisYear}/${dateString}`);

  if (selectedDate) thisDate = new Date(selectedDate);

  today = thisDate.getDay();

  if (today > 1) {
    const offset = today - 1;
    thisDate = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate() - offset);
    today = today - offset;
  }

  const thisWeek: string[] = [
    formatDate(thisDate, 0, options, true),
    formatDate(thisDate, 1, options, true),
    formatDate(thisDate, 2, options, true),
    formatDate(thisDate, 3, options, true),
    formatDate(thisDate, 4, options, true),
    formatDate(thisDate, 5, options, true),
    formatDate(thisDate, -1, options, false),
  ];

  // const nextWeek: string[] = [
  //   formatDate(thisDate, 1, options, false),
  //   formatDate(thisDate, 2, options, false),
  //   formatDate(thisDate, 3, options, false),
  //   formatDate(thisDate, 4, options, false),
  //   formatDate(thisDate, 5, options, false),
  //   formatDate(thisDate, 6, options, false),
  //   formatDate(thisDate, 0, options, false),
  // ];

  //  var next = new Date(now.getFullYear(), now.getMonth(), now.getDate()+(8 - now.getDay()));
  return thisWeek;
};

export default getWeekDates;
