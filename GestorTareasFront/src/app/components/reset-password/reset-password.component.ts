import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BackResponse } from 'src/app/models/Login.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  userEmail: string = '';
  isResetForm: boolean = false;
  hide = true;

  validaciones = {
    password: [
      { type: 'required', message: 'La contraseña es requerida' },
      {
        type: 'pattern',
        message:
          'Este campo debe contener al menos 1 mayusculas, minusculas, numeros y caracteres especiales',
      },
      { type: 'minlength', message: 'El mínimo de caracteres es 8' },
    ],
    repeatPassword: [
      { type: 'required', message: 'El campo es requerido' },
      { type: 'passwordMismatch', message: 'Las contraseñas no coinciden' },
    ],
  };

  resetPForm: FormGroup = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
          ),
          Validators.minLength(8),
        ],
      ],
      repeatPassword: ['', Validators.required],
    },
    {
      validator: this.passwordMatchValidator('password', 'repeatPassword'),
    }
  );

  constructor(
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  sendCode() {
    if (this.userEmail.trim().length > 0) {
      this.loginService.sendCode(this.userEmail).subscribe(
        (resp: BackResponse) => {
          if (resp.estado === 0) {
            Swal.fire({
              text: resp.mensaje,
              icon: 'success',
              timer: 3000,
              backdrop: false,
            }).then(async () => {
              const { value: code } = await Swal.fire({
                title: 'Restablecer Contraseña - Gustoes',
                text: 'Por favor, introduce el código enviado a tu correo:',
                input: 'number',
                inputPlaceholder: 'Código',
                inputAttributes: {
                  maxLength: '6',
                },
                showCancelButton: false,
                cancelButtonText: 'Cancelar',
                backdrop: false,
              });

              this.loginService.validCode(code, resp.objeto).subscribe(
                (resp) => {
                  if (resp.estado === 0) {
                    Swal.fire({
                      title: 'Código valido',
                      text: 'El código ha sido validado correctamente. Ahora puedes proceder con el restablecimiento de tu contraseña.',
                      icon: 'success',
                      timer: 3000,
                      backdrop: false,
                      showConfirmButton: false,
                    }).then(() => {
                      this.isResetForm = true;
                    });
                  }
                },
                (error) => {
                  Swal.fire({
                    title: 'Error',
                    text: error.error.mensaje,
                    icon: 'error',
                    timer: 3000,
                    backdrop: false,
                  });

                  console.error(error);
                }
              );
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: resp.mensaje,
              icon: 'error',
              timer: 3000,
              backdrop: false,
            });
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error en el servidor',
            icon: 'error',
            timer: 3000,
            backdrop: false,
          });

          console.error(error);
        }
      );
    } else {
      Swal.fire({
        text: 'Introduce tu correo electronico',
        icon: 'info',
        timer: 2000,
        backdrop: false,
        showConfirmButton: false,
      });
    }
  }

  updatePassword() {
    this.loginService
      .updatePassword(this.userEmail, this.resetPForm.get('password')?.value)
      .subscribe(
        (resp) => {
          if (resp.estado === 0) {
            Swal.fire({
              title: 'Contraseña Reestablecida',
              text: resp.mensaje,
              icon: 'success',
              timer: 3000,
              backdrop: `
              no-repeat
            `,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/login']);
            });
          }
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.mensaje,
            icon: 'error',
            timer: 3000,
            backdrop: false,
          });

          console.error(error);
        }
      );
  }

  passwordMatchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidationErrors | null {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (matchingControl?.value == null || matchingControl?.value == '') {
        matchingControl?.setErrors({ required: true });
        return { required: true };
      } else if (
        control &&
        matchingControl &&
        control.value !== matchingControl.value
      ) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        matchingControl?.setErrors(null);
        return null;
      }
    };
  }

  get password() {
    return this.resetPForm.get('password');
  }

  get repeatPassword() {
    return this.resetPForm.get('repeatPassword');
  }
}
