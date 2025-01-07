import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const formatDateToDDMMYYYY = (dateInput: string | Date): string => {
  const date = dayjs(dateInput).utc();

  const formattedDate = date.format('DD/MM/YYYY');
  return formattedDate;
};

export {
  formatDateToDDMMYYYY
}