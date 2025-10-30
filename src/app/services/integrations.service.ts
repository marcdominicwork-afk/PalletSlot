import { Injectable } from '@angular/core';
import { Base44ClientService } from './base44-client.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  public readonly Core;
  public readonly InvokeLLM;
  public readonly SendEmail;
  public readonly UploadFile;
  public readonly GenerateImage;
  public readonly ExtractDataFromUploadedFile;
  public readonly CreateFileSignedUrl;
  public readonly UploadPrivateFile;

  constructor(private base44Client: Base44ClientService) {
    const client = this.base44Client.client;
    
    this.Core = client.integrations.Core;
    this.InvokeLLM = client.integrations.Core.InvokeLLM;
    this.SendEmail = client.integrations.Core.SendEmail;
    this.UploadFile = client.integrations.Core.UploadFile;
    this.GenerateImage = client.integrations.Core.GenerateImage;
    this.ExtractDataFromUploadedFile = client.integrations.Core.ExtractDataFromUploadedFile;
    this.CreateFileSignedUrl = client.integrations.Core.CreateFileSignedUrl;
    this.UploadPrivateFile = client.integrations.Core.UploadPrivateFile;
  }
}
