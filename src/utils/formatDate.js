import { parseISO, isValid, format } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';

  const parsedDate = parseISO(dateString);
  if (!isValid(parsedDate)) return '';

  return format(parsedDate, 'dd/MM/yyyy');
};
