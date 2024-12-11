import { TestBed } from '@angular/core/testing';

import { ActividadColaboradorService } from './actividad-colaborador.service';

describe('ActividadColaboradorService', () => {
  let service: ActividadColaboradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActividadColaboradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
