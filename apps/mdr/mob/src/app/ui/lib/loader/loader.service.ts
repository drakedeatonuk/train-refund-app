import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  public appIsLoading = new BehaviorSubject(false);
  public loading$ = this.appIsLoading.asObservable()

  set loading(isLoading: boolean){
    this.appIsLoading.next(isLoading);
  }

}
