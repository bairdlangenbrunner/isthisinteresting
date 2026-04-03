export const formatDate = (dateString: string) => {
  return new Date(`${dateString} EDT`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    // timeZone: "UTC",
  });
};

export const formatDateISO = (dateString: string) => {
  return new Date(`${dateString} EDT`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
