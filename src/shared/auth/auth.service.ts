import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccountServiceProxy, CarioAuthenticateRequest, CarioAuthenticateResponse } from '../service-proxies/service-proxies';

export interface LoginInfo {
  userId: number;
  accessToken: string;
  expireInSeconds: number;
  isEmailConfirmed: boolean;
  twoFactorRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<LoginInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private accountService: AccountServiceProxy,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(tenant: string, username: string, password: string, rememberMe: boolean = true): Observable<CarioAuthenticateResponse> {
    const request = new CarioAuthenticateRequest({
      tenancyName: tenant,
      userNameOrEmailAddress: username,
      password: password
    });

    return this.accountService.login(request).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.handleLoginSuccess(response, rememberMe);
        }
      })
    );
  }

  private handleLoginSuccess(result: any, rememberMe: boolean): void {
    const loginInfo: LoginInfo = {
      userId: result.userId,
      accessToken: result.accessToken,
      expireInSeconds: result.expireInSeconds,
      isEmailConfirmed: result.isEmailConfirmed,
      twoFactorRequired: result.twoFactorRequired
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('access_token', loginInfo.accessToken);
    storage.setItem('user_info', JSON.stringify(loginInfo));

    this.currentUserSubject.next(loginInfo);
  }

  private loadUserFromStorage(): void {
    const token = sessionStorage.getItem('access_token') ||
      localStorage.getItem('access_token');
    const userInfo = sessionStorage.getItem('user_info') ||
      localStorage.getItem('user_info');

    if (token && userInfo) {
      try {
        const loginInfo = JSON.parse(userInfo) as LoginInfo;
        this.currentUserSubject.next(loginInfo);
      } catch (e) {
        this.logout();
      }
    }
  }

  logout(): void {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('user_info');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token') ||
      localStorage.getItem('access_token');
  }

  getCurrentUser(): LoginInfo | null {
    return this.currentUserSubject.value;
  }
}
