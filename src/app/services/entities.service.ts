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
    
    this.Booking = client.entities.Booking;
    this.Arrival = client.entities.Arrival;
    this.Dock = client.entities.Dock;
    this.Company = client.entities.Company;
    this.VehicleType = client.entities.VehicleType;
    this.Carrier = client.entities.Carrier;
    this.Warehouse = client.entities.Warehouse;
    this.User = client.entities.User;
  }
}
