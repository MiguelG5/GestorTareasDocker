import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from 'src/app/services/colaboradores.service';
import { LoginService } from 'src/app/services/login.service';
import { Colaborador } from 'src/app/models/colaboradores';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {
  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Colaboradores', url: '/cuenta' },
  ];
  colaboradores: Colaborador[] = [];
  selectedColaborador: Colaborador | null = null;
  newEmail: string = '';
  isRegisterFormVisible: boolean = false;
  registerForm: FormGroup;
  selectedEmail: string = '';

  constructor(
    private colaboradorService: ColaboradorService,
    private loginService: LoginService,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
          Validators.minLength(8)
        ]
      ],
      id_colaborador: [''] // Agrega este campo
    });
  }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('usuario');
    if (userLoggedIn) {
      const userId = JSON.parse(userLoggedIn).id;

      this.colaboradorService.getColaboradoresByUser(userId).subscribe(
        (colaboradores) => {
          this.colaboradores = colaboradores;
        },
        (error) => {
          console.error('Error al obtener colaboradores del usuario:', error);
        }
      );
    } else {
      console.error('No se ha encontrado el usuario logueado.');
    }
  }

  selectColaborador(colaborador: Colaborador): void {
    this.selectedColaborador = colaborador;
    this.newEmail = colaborador.email;
  }

  updateColaborador(): void {
    if (this.selectedColaborador) {
      const updatedColaborador = {
        id: this.selectedColaborador.id,
        email: this.newEmail,
        password: '' // No se actualiza la contraseña
      };

      this.colaboradorService.updateColaborador(updatedColaborador).subscribe(
        (colaborador) => {
          console.log('Colaborador actualizado:', colaborador);
          this.selectedColaborador = null;
          this.newEmail = '';
          this.ngOnInit(); // Actualizar la lista de colaboradores
        },
        (error) => {
          console.error('Error al actualizar colaborador:', error);
        }
      );
    }
  }

  showRegisterForm(colaborador: Colaborador): void {
    this.isRegisterFormVisible = true;
    this.selectedEmail = colaborador.email;
    this.registerForm.patchValue({ id_colaborador: colaborador.id });
  }
  
  registerColaborador(): void {
    if (this.registerForm.valid) {
      const newColaborador = {
        username: this.registerForm.get('username')?.value,
        email: this.selectedEmail,
        password: this.registerForm.get('password')?.value,
        role: 'colaborador', // Asignar el rol de colaborador
        id_colaborador: this.registerForm.get('id_colaborador')?.value // Incluye id_colaborador
      };
  
      this.loginService.register(newColaborador).subscribe(
        (response) => {
          console.log('Colaborador registrado:', response);
          Swal.fire({
            title: '¡Colaborador registrado con éxito!',
            text: response.message,
            icon: 'success',
            backdrop: false,
            timer: 2000,
            showConfirmButton: false,
          });
          this.isRegisterFormVisible = false;
          this.registerForm.reset();
          this.selectedEmail = '';
          this.ngOnInit(); // Actualizar la lista de colaboradores
        },
        (error) => {
          console.error('Error al registrar colaborador:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar el colaborador.',
            icon: 'error',
            timer: 3000,
            backdrop: false,
          });
        }
      );
    } else {
      this.markAllAsDirty();
    }
  }
  

  markAllAsDirty(): void {
    Object.keys(this.registerForm.controls).forEach((controlName) => {
      const control = this.registerForm.get(controlName);
      control?.markAsTouched();
    });
  }

  get passwordErrors() {
    const control = this.registerForm.get('password');
    if (control?.errors) {
      return Object.keys(control.errors).map(errorKey => {
        switch (errorKey) {
          case 'required':
            return 'La contraseña es requerida';
          case 'pattern':
            return 'Este campo debe contener al menos 1 mayúscula, minúscula, números y caracteres especiales';
          case 'minlength':
            return 'Debe contener al menos 8 caracteres';
          default:
            return 'Error desconocido';
        }
      });
    }
    return [];
  }
}
