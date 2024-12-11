import { Component, OnInit } from '@angular/core';
interface Item {
  id: string;
  name: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  items: Item[] = [
    { id: 'mapa', name: 'Mapa del sitio' },
    { id: 'login', name: 'Inicio sesión' },
    { id: 'register', name: 'Registrarme' },
    { id: 'proyectos', name: 'Proyectos' },
  ];

  searchTerm: string = '';
  searchResults: Item[] = [];

  constructor() {}

  ngOnInit(): void {}

  search(): void {
    this.searchResults = this.items.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
