import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from "class-validator";
  
  @ValidatorConstraint({ name: "IsIranianNationalCode", async: false })
  export class IsIranianNationalCodeConstraint
    implements ValidatorConstraintInterface
  {
    validate(nationalCode: string, args: ValidationArguments) {
      // Check if the input is exactly 10 digits
      if (!nationalCode || nationalCode.length !== 10 || !/^\d{10}$/.test(nationalCode)) {
        return false;
      }
  
      // Checksum validation
      const check = +nationalCode[9]; // 10th digit (checksum)
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += +nationalCode[i] * (10 - i);
      }
      const remainder = sum % 11;
  
      // Validate the checksum
      if (remainder < 2) {
        return check === remainder;
      } else {
        return check === 11 - remainder;
      }
    }
  
    defaultMessage(args: ValidationArguments) {
      return "nationalCode is not a valid Iranian national code";
    }
  }
  
  export function IsIranianNationalCode(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsIranianNationalCodeConstraint,
      });
    };
  }