import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  public inventorySubject = new BehaviorSubject<Item[]>([]);

  inventory$ = this.inventorySubject;

  addItem(item: Item): void {
    this.inventorySubject.next([...this.inventorySubject.value, item]);
  }

  removeItem(itemId: number): void {
    this.inventorySubject.next(
      this.inventorySubject.value.filter((item) => item.id !== itemId)
    );
  }
}
