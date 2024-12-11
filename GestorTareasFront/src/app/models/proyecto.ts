export interface Proyecto {
  id: number;
  user_id: number;
  nombre_del_proyecto: string;
  descripcion: string;
  fecha_creacion?: Date;
  fecha_finalizacion: Date;
}
