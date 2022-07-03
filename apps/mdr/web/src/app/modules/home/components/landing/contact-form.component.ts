import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';
import { forbiddenNameValidator, doubleEntryValidator } from '../../../../shared/validators/validators';

@Component({
	selector: 'app-contact-form',
	templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {
	public contactForm = new FormGroup(
		{
			name: new FormControl('', [ Validators.required, Validators.minLength(4), forbiddenNameValidator(/bob/i) ]),
			email: new FormControl(''),
			company: new FormControl(''),
			message: new FormControl('')
		},
		{ validators: doubleEntryValidator }
	);

	constructor() {
		this.contactForm.valueChanges.subscribe((formGroup: FormGroup) => {
			console.log(this.contactForm.status);
			console.log(formGroup);
		});
	}

	ngOnInit(): void {}

	updateName(): void {// // set val for all fields
		this.contactForm.setValue({
			name: 'bob',
			email: 'e',
			company: 'c',
			message: 'm'
		});
		// set val for one fields
		this.contactForm.patchValue({
			name: 'boob'
		});
	}

	onSubmit(): void {
		console.warn(this.contactForm.value);
		console.log(this.contactForm);
	}

	get name(): AbstractControl | null {
		return this.contactForm.get('name');
	}

	get message(): AbstractControl | null {
		return this.contactForm.get('power');
	}
}
