import { formatDistanceToNow } from "date-fns";

export const formatFromNow = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true
  });
};