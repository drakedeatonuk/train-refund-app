import { AppConfig } from './app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
	date: any;
}

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	configUrl = './../../assets/data/config.json';

	constructor(private http: HttpClient) {}

	getConfig() {
		return this.http.get<Config>(this.configUrl);
	}

  getConfigResponse() {
    // the 'observe' object will ensure that the entire response object is returned, rather than just the data
    return this.http.get<Config>(this.configUrl, { observe: 'response' });
  }

}
