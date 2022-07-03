
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { stationNames } from '@multi/mdr';


export class CustomValidators {

  public static isStation(control: AbstractControl): { [key: string]: boolean } | null {
    const validator: ValidationErrors | null = !control.value || Object.keys(stationNames).includes(control.value)
      ? null
      : {
        isstation: {
          valid: false
        }
      };
    return validator;
  };

  public static isDifferentStations: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startStation = control.get('journeyStartStation');
    const endStation = control.get('journeyEndStation');
    return !startStation.value || !endStation.value || startStation.value != endStation.value
      ? null
      : {
        isdifferentstations: {
          valid: false
        }
      };
  };

  public static formHasChanges(originalForm: object): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value !== originalForm
        ? null
        : {
          formhaschanges: {
            valid: false
          }
        }
    }
  }
}
