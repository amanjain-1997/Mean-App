import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private adminListener = new Subject<boolean>();
  private isAdmin;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminListener() {
    return this.adminListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post("http://aqueous-plains-00254.herokuapp.com/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(["/login"]);

      },err => { 
        this.authStatusListener.next(false);
        },);
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, isAdmin:string }>(
        "http://aqueous-plains-00254.herokuapp.com/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        const isAdmin = response.isAdmin;
        console.log("Phase1"+isAdmin);
        this.isAdmin = isAdmin;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          if(isAdmin)
          this.adminListener.next(true);
          const now = new Date();
          console.log(expiresInDuration);
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate,email, isAdmin);
          this.router.navigate(["/home"]);
        }
      },err => { 
        this.authStatusListener.next(false);
        },);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAdmin = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.adminListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, email: string , isAdmin: string) {
    console.log(token);
    console.log(expirationDate);
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("email", email);
    console.log("Value of isAdmin during saving data" + isAdmin);
    localStorage.setItem("isAdmin", isAdmin);


  }
  getIsAdmin(){

    const isAdmin = localStorage.getItem("isAdmin");
    return isAdmin;

  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin");
  }


   getEmail(){
    const email = localStorage.getItem("email");
    if(!email){
        return ;
    }
    return email;
  }
  
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
