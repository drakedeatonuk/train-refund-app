import { Component, OnInit } from '@angular/core';
import { interval, from, fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'multi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'observables';
  ESC_CODE = 'Escape';
  public nameInput?: HTMLInputElement | null;

  ngOnInit(): void {

    // this.nameInput = document.getElementById('name') as HTMLInputElement;
    // this.nameInput.value = 'test'

    console.log('this.nameInput');
    console.log(this.nameInput);

    // new function. accepts a generic of any HTML event. Takes as args a HTML element, and the generic.
    // function fromEvent<T extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: T) {
    //   console.log('in fromEvent');
    //   console.log({target, eventName});

    //   // retruns a newly instantiated observable, which accepts a generic of the HTML event arg
    //   // and takes as argument a callback function, which takes as argument an observer
    //   return new Observable<HTMLElementEventMap[T]>((observer) => {

    //     // instantiates a handler function, which takes as an argument the HTML event arg
    //     const handler = (e: HTMLElementEventMap[T]) => {
    //       console.log('in handler() function')
    //       console.log(e);

    //       // returns the next event
    //       observer.next(e);
    //     };

    //     // Adds the event handler to the target
    //     target.addEventListener(eventName, handler);

    //     // return () => {

    //     //   // Detach the event handler from the target
    //     //   console.log('detaching...');
    //     //   target.removeEventListener(eventName, handler);
    //     // };
    //   });
    // }

    // // creates a subscription to the keydown event on the nameInput HTML elment. Takes as its arg a callback func.
    // let subscription = fromEvent(this.nameInput, 'keydown').subscribe((e: KeyboardEvent) => {

    //   // for every keydown event, if the key code is equal to the escape key...
    //   if (e.code === this.ESC_CODE) {

    //     //clear the HTML element's value
    //     if (this.nameInput !== null && this.nameInput !== undefined)
    //       this.nameInput.value = '';
    //   }

    // });


    // function fromEvent2<T extends keyof HTMLElementEventMap>(target: HTMLElement, eventName: T) {
    //   return new Observable<HTMLElementEventMap[T]>((observer) => {
    //     const handler = (e: HTMLElementEventMap[T]) => { observer.next(e); };
    //     target.addEventListener(eventName, handler);
    //   });
    // }
    // let subscription2 = fromEvent2(this.nameInput, 'keydown').subscribe((e: KeyboardEvent) => {
    //   if (e.code === this.ESC_CODE) {
    //     if (this.nameInput !== null && this.nameInput !== undefined)
    //       this.nameInput.value = '';
    //   }
    // });
    // console.log(subscription2);

    console.log('in test:');

    const el = document.getElementById('my-element')!;

    // Create an Observable that will publish mouse movements
    const mouseMoves = fromEvent<MouseEvent>(el, 'mousemove');

    // Subscribe to start listening for mouse-move events
    const subscription3 = mouseMoves.subscribe(evt => {
      console.log(evt);
      // Log coords of mouse movements
      console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);

      // When the mouse is over the upper-left of the screen,
      // unsubscribe to stop listening for mouse movements
      // if (evt.clientX < 40 && evt.clientY < 40) {
      //   subscription3.unsubscribe();
      // }
    });
  }

}
