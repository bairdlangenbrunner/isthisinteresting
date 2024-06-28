export const formatDate = (dateString: string) => {
  return new Date(`${dateString} EDT`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    // timeZone: "UTC",
  });
};

export const formatDateNoWeekday = (dateString: string) => {
  return new Date(`${dateString} EDT`).toLocaleDateString("en-US", {
    // weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    // timeZone: "UTC",
  });
};
