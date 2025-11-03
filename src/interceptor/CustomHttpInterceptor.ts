import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/api/Account/Login')) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    const token = this.getAuthToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private getAuthToken(): string | null {
    return sessionStorage.getItem('access_token') ||
      localStorage.getItem('access_token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.clearAuthData();
      this.router.navigate(['/login']);
    }

    return throwError(() => error);
  }

  private clearAuthData(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
  }
}
