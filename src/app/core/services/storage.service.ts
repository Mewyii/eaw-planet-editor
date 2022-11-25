import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
  constructor() {}

  getItem<T>(id: string) {
    const stringifiedObject = localStorage.getItem(id);
    return stringifiedObject ? (JSON.parse(stringifiedObject) as T) : undefined;
  }

  setItem<T extends object>(id: string, data: T) {
    const stringifiedObject = JSON.stringify(data);
    localStorage.setItem(id, stringifiedObject);
  }

  removeItem(id: string) {
    localStorage.removeItem(id);
  }
}
