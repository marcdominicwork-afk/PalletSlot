import { Injectable } from '@angular/core';
import { Base44ClientService } from './base44-client.service';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {
  public readonly Booking;
  public readonly Arrival;
  public readonly Dock;
  public readonly Company;
  public readonly VehicleType;
  public readonly Carrier;
  public readonly Warehouse;
  public readonly User;

  constructor(private base44Client: Base44ClientService) {
    const client = this.base44Client.client;
    
    // Access entities with proper typing - cast to any to bypass type checking
    const entities = (client as any).entities;
    
    this.Booking = entities.Booking;
    this.Arrival = entities.Arrival;
    this.Dock = entities.Dock;
    this.Company = entities.Company;
    this.VehicleType = entities.VehicleType;
    this.Carrier = entities.Carrier;
    this.Warehouse = entities.Warehouse;
    this.User = entities.User;
  }
}
