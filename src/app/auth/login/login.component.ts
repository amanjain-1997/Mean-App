import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit  {
  isLoading = false;
  showError = false;
  private authListenerSubs: Subscription;

  constructor(public authService: AuthService) {}
  ngOnInit() {
  
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.showError = !isAuthenticated;
      console.log(this.showError)
    });

  }


}
