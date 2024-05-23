export interface Validable {
  value: string | number;
  required?: boolean;
  minLenght?: number;
  maxLenght?: number;
  min?: number;
  max?: number;
}

export function validate(validableInput: Validable) {
  let isValid = true;
  if (validableInput.required) {
    isValid = isValid && validableInput.value.toString().trim().length !== 0;
  }
  if (
    validableInput.minLenght != null &&
    typeof validableInput.value === "string"
  ) {
    isValid =
      isValid && validableInput.value.length >= validableInput.minLenght;
  }
  if (
    validableInput.maxLenght != null &&
    typeof validableInput.value === "string"
  ) {
    isValid =
      isValid && validableInput.value.length <= validableInput.maxLenght;
  }
  if (validableInput.min != null && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value >= validableInput.min;
  }
  if (validableInput.max != null && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value <= validableInput.max;
  }
  return isValid;
}
