import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sandbox-page',
  templateUrl: './sandboxPage.component.html',
})
export class SandboxPageComponent {
  public isDiffDayArrival = true;
  selected: Date | null;

  now = new Date();
  minDate = new Date(this.now.valueOf() - (28 * 86400000));
  maxDate = this.now;
  dates: Date[];
  isInvalidDateTimes = true;
  @Output() addDateTimes = new EventEmitter<Date[]>();

  constructor(
    public modalController: ModalController,
  ){}

  async checkDateTimes(): Promise<void> {
    this.isInvalidDateTimes = !(this.dates?.length == 2);
  }

  async confirm(): Promise<void> {
    this.addDateTimes.emit(this.dates);
    this.modalController.dismiss();
  }

  async close(): Promise<void> {
    this.modalController.dismiss();
  }
}

