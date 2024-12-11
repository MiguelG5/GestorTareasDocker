import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginaerror',
  templateUrl: './paginaerror.component.html',
  styleUrls: ['./paginaerror.component.css']
})
export class PaginaerrorComponent implements OnInit {

  breadcrumbs = [
    { label: 'Inicio', url: '' },
    { label: 'Página no disponible', url: 'error' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
