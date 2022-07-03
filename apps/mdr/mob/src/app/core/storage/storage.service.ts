import { LocalData } from './constants/storage.constants';
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public async set(key: LocalData, value: any): Promise<void> {
    console.log('in set', {key: key, value: value});
    try {
      this._storage?.set(key, JSON.parse(JSON.stringify(value)));
    } catch (e) {
      console.log(e);
      this._storage?.set(key, value);
    };
  }

  public async get<T>(key: LocalData): Promise<T | null> {
    let localData: string | {} | [] | null;
    try {
      localData = await this._storage.get(key);
    } catch (e) {
      console.log(e);
      return null;
    }
    if (!localData) return null;
    else return localData as T;
  }

  public async remove(key: LocalData) {
    await this._storage.remove(key);
  }

  public async clear() {
    return this._storage.clear();
  }

}
