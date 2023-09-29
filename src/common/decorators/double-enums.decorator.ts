import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEnumInTwoEnums(
  enum1: object,
  enum2: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [enum1, enum2],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [enum1, enum2] = args.constraints;
          return (
            Object.values(enum1).includes(value) ||
            Object.values(enum2).includes(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${
            args.property
          } must be a valid enum value in either Enum1: >>>>> ${Object.values(
            enum1,
          ).join(' <<<<<, >>>>> ')} <<<<< or Enum2: >>>>> ${Object.values(
            enum2,
          ).join(' <<<<<, >>>>> ')} <<<<<`;
        },
      },
    });
  };
}
