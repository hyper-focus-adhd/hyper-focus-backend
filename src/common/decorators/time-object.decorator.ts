import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as moment from 'moment';

import { messagesHelper } from '../../helpers/messages-helper';

interface DateRange {
  date: {
    start: Date;
    end: Date;
  };
}

@ValidatorConstraint({ async: false })
export class ValidTimesValidator implements ValidatorConstraintInterface {
  private constraints: number[] = [];

  validate(
    time: { start: Date; end: Date },
    args: ValidationArguments,
  ): boolean {
    const date = (args.object as DateRange).date;
    const { start, end } = time;

    // Validate time format
    const timeFormat = ['HH:mm:ss', 'hh:mm:ss a'];
    const startIsValid = moment(start, timeFormat, true).isValid();
    const endIsValid = moment(end, timeFormat, true).isValid();
    if (!startIsValid) {
      this.constraints.push(1); // Set the flag to indicate invalid start date format
      return false;
    } else if (end && !endIsValid) {
      this.constraints.push(2); // Set the flag to indicate invalid end date format
      return false;
    }

    // Validate if the start time is before the end time
    if (date.start === date.end && start > end) {
      this.constraints.push(3); // Set the flag to indicate start time validation failure
      return false;
    }

    return true;
  }

  defaultMessage(): string {
    const startValidationFailed = this.constraints.includes(1);
    const endValidationFailed = this.constraints.includes(2);

    if (startValidationFailed) {
      this.constraints.pop();
      return messagesHelper.TIME_FORMAT_START;
    }
    if (endValidationFailed) {
      this.constraints.pop();
      return messagesHelper.TIME_FORMAT_END;
    }

    this.constraints.pop();
    return messagesHelper.TIME_RANGE;
  }
}

export function IsTimeObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidTimesValidator,
    });
  };
}
