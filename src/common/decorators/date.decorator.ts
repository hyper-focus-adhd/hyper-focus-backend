import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

import { messagesHelper } from '../../helpers/messages-helper';

@ValidatorConstraint({ async: false })
export class ValidDatesValidator implements ValidatorConstraintInterface {
  validate(date: Date): boolean {
    // Validate date format
    const dateFormat = ['DD-MM-YYYY', 'MM-DD-YYYY'];
    return moment(date, dateFormat, true).isValid();
  }

  defaultMessage(): string {
    return messagesHelper.DATE_FORMAT;
  }
}

export function IsCustomDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidDatesValidator,
    });
  };
}
