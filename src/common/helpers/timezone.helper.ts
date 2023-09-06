import * as moment from 'moment-timezone';

// Get your current time zone dynamically
export const currentTimeZone = (value: Date): string => {
  const timeZoneNow = moment.tz.guess();

  return moment.utc(value).tz(timeZoneNow).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
};
