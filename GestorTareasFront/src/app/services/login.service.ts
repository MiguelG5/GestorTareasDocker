import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  BackResponse,
  UserResponse,
  UserListResponse, // Import the new model for the list of users
} from "../models/Login.model";

import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private userSubject: BehaviorSubject<UserResponse | null> =
    new BehaviorSubject<UserResponse | null>(null);
  public user$: Observable<UserResponse | null> =
    this.userSubject.asObservable();

  URL_API = `${environment.API_URL}/api/user`;

  constructor(public http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.URL_API}/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post<RegisterResponse>(`${this.URL_API}/register`, data);
  }

  setUser(user: UserResponse | null) {
    this.userSubject.next(user);
  }

  sendCode(email: string) {
    const data = {
      correo: email,
    };

    return this.http.post<BackResponse>(`${this.URL_API}/sendCode`, data);
  }

  validCode(code: string, secret: string) {
    const data = {
      codigo: code,
      secret: secret,
    };

    return this.http.post<BackResponse>(`${this.URL_API}/validCode`, data);
  }

  updatePassword(email: string, password: string) {
    const data = {
      correo: email,
      password: password,
    };

    return this.http.put<BackResponse>(`${this.URL_API}/updatePassword`, data);
  }

  secondFactor(email: string) {
    const data = {
      correo: email,
    };

    return this.http.post<BackResponse>(`${this.URL_API}/secondFactor`, data);
  }

  validarcorreo(email: string) {
    const data = {
      correo: email,
    };

    return this.http.post<BackResponse>(`${this.URL_API}/validarcorreo`, data);
  }

  updateUserRoleToAdmin(userId: number): Observable<BackResponse> {
    const data = {
      user_id: userId,
    };

    return this.http.put<BackResponse>(
      `${this.URL_API}/updateUserRoleToAdmin`,
      data
    );
  }
  getAllUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.URL_API}/users`);
  }
}
