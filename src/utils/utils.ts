import { AppConstants } from '../config/appConstants';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { Meta } from '../config/types';

export const encryptString = (text: string) => {
  return bcrypt.hash(text, AppConstants.saltRounds);
};

export const compareString = (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
};

export const formatProjectDate = (date: string) => {
  return moment.utc(date, 'DD/MM/YYYY').toDate();
};

export const getMetaData = (meta: Meta, total: number) => {
  meta.total_pages = Math.ceil(total / (meta.per_page ?? 1));
  meta.total_count = total;
  if (meta.page < meta.total_pages) {
    meta.next_page = meta.page + 1;
  } else {
    meta.next_page = null;
  }
  meta.per_page = undefined;

  return meta;
};
