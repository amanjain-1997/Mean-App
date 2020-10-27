import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userIsAdmin=false;
  str;
  private authListenerSubs: Subscription;
  private adminListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.str = this.authService.getIsAdmin();
    if(this.userIsAuthenticated && this.str == "true"){
      this.userIsAdmin=true;
    }
    console.log("Phase2" + this.userIsAdmin);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

      this.adminListenerSubs = this.authService
      .getAdminListener()
      .subscribe(isAuthenticated => {
        this.userIsAdmin = isAuthenticated;
      });
  }


 
  

  

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }
}
