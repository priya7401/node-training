import moment from 'moment';

export const formatProjectDate = (date: string) => {
  return moment.utc(date, 'DD/MM/YYYY').toDate();
};
