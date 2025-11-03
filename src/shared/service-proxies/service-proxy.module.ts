import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import * as ApiServiceProxies from './service-proxies';
import { CustomHttpInterceptor } from '../../interceptor/CustomHttpInterceptor';

@NgModule({
  providers: [
    ApiServiceProxies.AccountServiceProxy,
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true }
  ]
})
export class ServiceProxyModule { }
