import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from 'src/app/models/Login.model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: UserResponse | null = null;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loginService.user$.subscribe((user) => {
      this.user = user;
    });

    if (this.user === null) {
      this.user = JSON.parse(localStorage.getItem('usuario')!);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  showFullName: boolean = false;

  hideFullName() {
    // Se oculta el nombre completo solo si el cursor sale tanto del botón como del área donde se muestra el nombre completo
    this.showFullName = false;
  }
  isCollaborator(): boolean {
    return this.user?.role === 'colaborador';
  }
  isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }
  isUser(): boolean {
    return this.user?.role === 'user';
  }
  isMaster(): boolean {
    return this.user?.role === 'Master';
  }
}
