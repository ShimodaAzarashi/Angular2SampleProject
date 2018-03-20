import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService }      from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router
  ) {
    this.setMessage();
  }

  ngOnInit() {
  }

  tryLogin(): void{
    let link = ['/dashboard'];
    this.router.navigate(link);

  }


  message: string;

  setMessage() {
//    this.message = 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
    this.message = '' + (this.authService.isLoggedIn ? '' : 'not logged in');
  }

  login(email :string, password :string) {
    this.message = 'Trying to log in ...';

//    this.authService.login(email, password).subscribe(() => {
    this.authService.login(email, password).then(() => {
      this.setMessage();
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/dashboard';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          preserveQueryParams: true,
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.setMessage();
  }
}
