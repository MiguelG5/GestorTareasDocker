export interface Paquete {
    id: number;
    nombre_paquete: string;
    descripcion: string | null; // Puede ser nulo si no se proporciona
    costo: number;
    duracion: number; // Duración en días
    numero_colaboradores: number; // Nueva propiedad
}
