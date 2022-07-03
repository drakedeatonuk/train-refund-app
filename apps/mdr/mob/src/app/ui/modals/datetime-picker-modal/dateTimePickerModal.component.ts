import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, Output, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { simpleDateCanada, simpleTimeUK } from '@multi/shared';

@Component({
  selector: 'app-date-time-picker-modal',
  templateUrl: './dateTimePickerModal.component.html',
})
export class DateTimePickerModalComponent implements OnInit {
  now = new Date();
  minDate = new Date(this.now.valueOf() - 28 * 86400000);
  maxDate = this.now;
  dates: Date[];
  calDatePicked: Date = new Date();
  isValidDateTimes = false;
  isNextDayArrival = false;
  endIsAfterStart = false;
  timesAreChronological = false;
  isEndTimeInPast = false;
  isStartTimeInPast = false;
  timesAreInPast = false;
  @Output() addDateTimes = new EventEmitter<Date[]>();
  simpleDateCanada = simpleDateCanada;
  simpleTimeUK = simpleTimeUK;
  @Input() journeyStartDateTime: Date;
  @Input() journeyEndDateTime: Date;
  @ViewChild('endTime') endTimeElement: ElementRef;

  constructor(public modalController: ModalController) {}

  ngOnInit(): void {
    this.calDatePicked = this.journeyStartDateTime ? this.journeyStartDateTime : this.now;
    this.dates = [this.journeyStartDateTime, this.journeyEndDateTime];
    console.log(this.dates);
    this.checkTimes();
  }

  async updateDate(date: CustomEvent): Promise<void> {
    this.calDatePicked = new Date(date.detail.value);
    this.checkTimes();
  }

  async confirm(): Promise<void> {
    console.log(this.calDatePicked);
    const startTime = new Date(
      this.calDatePicked.setHours(this.journeyStartDateTime.getHours(), this.journeyStartDateTime.getMinutes(), 0)
    );
    let endTime = new Date(
      this.calDatePicked.setHours(this.journeyEndDateTime.getHours(), this.journeyEndDateTime.getMinutes(), 0)
    );
    if (this.isNextDayArrival) endTime = new Date(endTime.setDate(endTime.getDate() + 1));
    this.dates = [startTime, endTime];
    this.addDateTimes.emit(this.dates);
    this.modalController.dismiss();
  }

  async startTimeChange(time: Date) {
    this.journeyStartDateTime = new Date(time);
    await this.checkTimes();
    // changing focus to stop UI bug where NgModel wasn't being refreshed
    this.endTimeElement.nativeElement.focus();
  }

  async endTimeChange(time: Date) {
    this.journeyEndDateTime = new Date(time);
    await this.checkTimes();
  }

  async checkTimes() {
    if (this.journeyStartDateTime ! && this.journeyEndDateTime) {
      this.isStartTimeInPast = this.calDatePicked.getDate() < this.now.getDate() || this.journeyStartDateTime.getTime() < this.now.getTime();
      this.isEndTimeInPast = this.calDatePicked.getDate() < this.now.getDate() || this.journeyEndDateTime.getTime() < this.now.getTime();
    }

    if (this.journeyStartDateTime && this.journeyEndDateTime)
      this.endIsAfterStart = this.journeyStartDateTime < this.journeyEndDateTime;

    this.timesAreChronological = (
      this.isNextDayArrival ||
      (!this.isNextDayArrival && this.endIsAfterStart)
    );

    console.log('timesAreInPast:')
    console.log('this.isStartTimeInPast', this.isStartTimeInPast);
    console.log('this.journeyStartDateTime.getTime() < this.now.getTime()', this.journeyStartDateTime.getTime() < this.now.getTime());
    console.log('this.calDatePicked.getDate() <= this.now.getDate()', this.calDatePicked.getDate() <= this.now.getDate());
    console.log('this.isEndTimeInPast', this.isEndTimeInPast);
    console.log('this.journeyEndDateTime.getTime() < this.now.getTime()', this.journeyEndDateTime.getTime() < this.now.getTime());
    console.log('this.calDatePicked.getDate() <= this.now.getDate()', this.calDatePicked.getDate() <= this.now.getDate());

    console.log('(this.isEndTimeInPast && this.isStartTimeInPast)', (this.isEndTimeInPast && this.isStartTimeInPast))
    console.log('(this.isNextDayArrival && this.isStartTimeInPast && !this.isEndTimeInPast)', (this.isNextDayArrival && this.isStartTimeInPast && !this.isEndTimeInPast));

    this.timesAreInPast = (
      (this.isEndTimeInPast && this.isStartTimeInPast) ||
      (this.isNextDayArrival && this.isStartTimeInPast && !this.isEndTimeInPast)
    );

    console.log({
      journeyStartDateTime: !!this.journeyStartDateTime,
      journeyEndDateTime: !!this.journeyEndDateTime,
      endIsAfterStart: this.endIsAfterStart,
      timesAreInPast: this.timesAreInPast,
      timesAreChronological: this.timesAreChronological,
    })

    this.isValidDateTimes = (
      !!this.journeyStartDateTime &&
      !!this.journeyEndDateTime &&
      !!this.timesAreChronological &&
      !!this.timesAreInPast
    );
  }

  async changeIsNextDayArrival() {
    this.isNextDayArrival = !this.isNextDayArrival;
    this.checkTimes();
  }

  async close(): Promise<void> {
    this.modalController.dismiss();
  }
}
