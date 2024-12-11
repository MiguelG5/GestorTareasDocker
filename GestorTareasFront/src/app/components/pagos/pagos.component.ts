import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagoService } from 'src/app/services/pagos.service';
import { LoginService } from 'src/app/services/login.service'; 
import { Paquete } from 'src/app/models/paquetes';
import { Pago } from 'src/app/models/pago';
import { UserResponse } from 'src/app/models/Login.model';

declare var paypal: any;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements AfterViewInit {
  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Pagos', url: '/pagos' },
  ];
  
  @ViewChild('paypal', {static: false}) paypalElement!: ElementRef;

  paquete: Paquete | null = null;
  userId: number | null = null;

  constructor(private router: Router, private pagoService: PagoService, private loginService: LoginService) {
    const navigation = this.router.getCurrentNavigation();
    this.paquete = navigation?.extras.state?.['paquete'] || null;
  }

  ngAfterViewInit(): void {
    // Obtener el ID del usuario logueado desde el localStorage
    const userLoggedIn = localStorage.getItem('usuario');
    if (userLoggedIn) {
      this.userId = JSON.parse(userLoggedIn).id;
    }

    // Renderizar los botones de PayPal
    if (this.paquete) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.paquete?.costo.toString(), // El costo del paquete como string
                currency_code: 'MXN' // Especificar la moneda en MXN
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.registrarPago(); // Registrar el pago en la base de datos después de una transacción exitosa
          });
        }
      }).render(this.paypalElement.nativeElement);
    }
  }

  registrarPago(): void {
    if (!this.paquete || this.userId === null) {
      alert('Error: no se ha podido obtener la información necesaria.');
      return;
    }

    const fechaInicio = new Date();
    const fechaFinalizacion = new Date();
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + this.paquete.duracion);

    const nuevoPago: Pago = {
      id: 0,
      user_id: this.userId,
      paquete_id: this.paquete.id,
      fecha_inicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fecha_finalizacion: fechaFinalizacion.toISOString().split('T')[0] // Formato YYYY-MM-DD
    };

    this.pagoService.createPago(nuevoPago).subscribe(
      (res) => {
        alert('Pago realizado con éxito');
        this.router.navigate(['']);
        // Actualizar el rol del usuario a Admin en el frontend
        if (this.userId !== null) {
          this.loginService.updateUserRoleToAdmin(this.userId).subscribe(
            (updateRes) => {
              if (updateRes && updateRes.success) {
                alert('Rol de usuario actualizado a Admin');
                // Aquí puedes redirigir a una página específica si es necesario
              } else {
                console.error('Error al actualizar rol del usuario:', updateRes?.error);
              }
            },
            (updateErr) => console.error('Error al actualizar rol del usuario:', updateErr)
          );
        }
      },
      (err) => console.error(err)
    );
  }
}
