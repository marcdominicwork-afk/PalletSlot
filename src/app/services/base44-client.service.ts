import { Injectable } from '@angular/core';
import { createClient } from '@base44/sdk';

@Injectable({
  providedIn: 'root'
})
export class Base44ClientService {
  public readonly client;

  constructor() {
    this.client = createClient({
      appId: "686da6b2eae3506b158ea8b1",
      requiresAuth: false
    });
  }
}
