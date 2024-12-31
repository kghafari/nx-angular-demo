import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public save(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public load(key: string): any {
    return localStorage.getItem(key);
  }
}
