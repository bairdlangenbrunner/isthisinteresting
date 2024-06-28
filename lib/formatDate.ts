export const formatDate = (dateString: string) => {
  return new Date(`${dateString} EDT`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // timeZone: "UTC",
  });
};
