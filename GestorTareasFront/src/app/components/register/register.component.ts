import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from 'src/app/models/Login.model'; // Asegúrate de importar correctamente el modelo
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hide = true;
  validaciones = {
    username: [
      { type: 'required', message: 'El nombre de usuario es requerido' },
    ],
    email: [
      { type: 'required', message: 'El correo electrónico es requerido' },
      { type: 'email', message: 'Este no es un correo valido' },
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida' },
      {
        type: 'pattern',
        message:
          'Este campo debe contener al menos 1 mayúscula, 1 minúscula, números y caracteres especiales',
      },
      { type: 'minlength', message: 'Debe contener al menos 8 caracteres' },
    ],
    repeatPassword: [
      { type: 'required', message: 'El campo es requerido' },
      { type: 'passwordMismatch', message: 'Las contraseñas no coinciden' },
    ],
    aceptarTerminos: [
      { type: 'required', message: 'Debes aceptar los Términos y Condiciones' },
    ],
    captcha: [{ type: 'required', message: 'Debes validar el captcha' }],
  };

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    captcha: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
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
    razon_social: [''], // Campo de razón social inicializado como opcional
    aceptarTerminos: [false, [Validators.requiredTrue]],
  }, {
    validator: this.passwordMatchValidator('password', 'repeatPassword'),
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  register() {
    if (!this.registerForm.valid) {
      this.markAllAsDirty();
      return;
    }

    let rol: string = 'user';
    const email: string = this.registerForm.get('email')?.value;

    if (email.endsWith('hotmail.com') || email.endsWith('outlook.com')) {
      rol = 'admin';
    }

    let data: RegisterRequest = {
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: rol,
      razon_social: this.registerForm.get('razon_social')?.value || null, // Asegura que se tome el valor correctamente
    };

    this.loginService
      .validarcorreo(this.registerForm.get('email')?.value)
      .subscribe(async (respV) => {
        const { value: code } = await Swal.fire({
          text: 'Se ha enviado un código para validar el correo.',
          input: 'text',
          inputValue: '',
          inputAttributes: {
            maxLength: '6',
          },
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          backdrop: false,
        });

        this.loginService.validCode(code, respV.objeto).subscribe(
          (resp) => {
            if (resp.estado === 0) {
              this.loginService.register(data).subscribe(
                async (resp) => {
                  Swal.fire({
                    title: '¡Cuenta creada con éxito!',
                    text: resp.message,
                    icon: 'success',
                    backdrop: false,
                    timer: 2000,
                    showConfirmButton: false,
                  }).then(() => {
                    this.router.navigate(['']);
                    this.loginService.setUser(resp.user);
                    localStorage.setItem('usuario', JSON.stringify(resp.user));
                  });
                },
                (err) => {
                  Swal.fire({
                    title: 'Ocurrió un error en el sistema',
                    text: err.error.message,
                    icon: 'error',
                    backdrop: false,
                    timer: 2000,
                    showConfirmButton: false,
                  });
                }
              );
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

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatPassword() {
    return this.registerForm.get('repeatPassword');
  }

  get razonSocial() {
    return this.registerForm.get('razonSocial');
  }

  get aceptarTerminos() {
    return this.registerForm.get('aceptarTerminos');
  }

  markAllAsDirty() {
    Object.keys(this.registerForm.controls).forEach((controlName) => {
      const control = this.registerForm.get(controlName);
      control?.markAsTouched();
    });
  }
}
