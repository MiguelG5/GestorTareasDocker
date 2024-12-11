// colaboradores.ts
export interface Colaborador {
  id: number;
  usuario_id: number;
  email: string;
  contrasena: string;
  pago_id: number;
  selected: boolean; // Agregar esta propiedad
}
