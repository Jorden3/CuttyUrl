import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user: User;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe((user) =>{
      this.user = user;
    });
  }

  test() {

    console.log(this.user.createdUrls[0]);
  }

}
