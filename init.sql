-- Tabla 'users'
CREATE TABLE users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20),
    razon_social character varying(255),
    id_colaborador integer
);

-- Tabla 'colaboradores'
CREATE TABLE colaboradores (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    usuario_id integer NOT NULL,
    pago_id integer NOT NULL
);

-- Tabla 'actividades'
CREATE TABLE actividades (
    id integer NOT NULL,
    proyecto_id integer NOT NULL,
    nombre_actividad character varying(255) NOT NULL,
    descripcion text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_finalizacion timestamp without time zone
);

-- Tabla 'actividad_colaborador'
CREATE TABLE actividad_colaborador (
    id integer NOT NULL,
    actividad_id integer NOT NULL,
    colaborador_id integer NOT NULL,
    fecha_asignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
        REFERENCES public.actividades (id) MATCH SIMPLE,
        REFERENCES public.colaboradores (id) MATCH SIMPLE
);

-- Tabla 'pagos'
CREATE TABLE pagos (
    id integer NOT NULL,
    user_id integer NOT NULL,
    fecha_inicio date NOT NULL,
    fecha_finalizacion date NOT NULL,
    paquete_id integer NOT NULL,
        REFERENCES public.paquetes (id) MATCH SIMPLE,
        REFERENCES public.users (id) MATCH SIMPLE
);

-- Tabla 'paquetes'
CREATE TABLE paquetes (
    id integer NOT NULL,
    nombre_paquete character varying(255) NOT NULL,
    descripcion text,
    costo numeric(10,2) NOT NULL,
    duracion integer NOT NULL,
    numero_colaboradores numeric DEFAULT 0,
);

-- Tabla 'proyecto'
CREATE TABLE proyecto (
    id integer NOT NULL,
    user_id integer NOT NULL,
    nombre_del_proyecto character varying(255) NOT NULL,
    descripcion text,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_finalizacion timestamp without time zone,
        REFERENCES public.users (id) MATCH SIMPLE
);
