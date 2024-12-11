import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.css']
})
export class TerminosComponent implements OnInit {

  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Terminos y condiciones', url: 'condiciones' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
