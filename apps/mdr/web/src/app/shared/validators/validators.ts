import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const forbidden = nameRe.test(control.value);
		return forbidden ? { forbiddenName: { value: control.value } } : null;
	};
}

export function doubleEntryValidator(control: AbstractControl): ValidationErrors | null {
	const name = control.get('name');
	const message = control.get('message');

	console.log(name && message && name.value === message.value);

	return name && message && name.value === message.value ? { doubleEntry: true } : null;
}
