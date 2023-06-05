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
  private constraints: number[] = [];

  validate(date: { start: Date; end: Date }): boolean {
    const { start, end } = date;

    // Validate date format
    const dateFormat = ['DD-MM-YYYY', 'MM-DD-YYYY'];
    const startIsValid = moment(start, dateFormat, true).isValid();
    const endIsValid = moment(end, dateFormat, true).isValid();
    if (!startIsValid) {
      this.constraints.push(1); // Set the flag to indicate invalid start date format
      return false;
    } else if (!endIsValid) {
      this.constraints.push(2); // Set the flag to indicate invalid end date format
      return false;
    }

    // Validate if the start date is before the end date
    if (start > end) {
      this.constraints.push(3); // Set the flag to indicate start date validation failure
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    const startValidationFailed = this.constraints.includes(1);
    const endValidationFailed = this.constraints.includes(2);

    if (startValidationFailed) {
      return messagesHelper.DATE_FORMAT_START;
    }
    if (endValidationFailed) {
      return messagesHelper.DATE_FORMAT_END;
    }

    return messagesHelper.DATE_RANGE;
  }
}

export function IsDateObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidDatesValidator,
    });
  };
}
