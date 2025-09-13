export type IProductos = {
  producto_ID: string;
  producto_id_jovas: number | null;
  producto_descripcion: string;
  producto_pasillo: number;
  producto_rack_nivel: number;
  producto_registro: string;
};

export type ITipoPresentacion = "PIEZA" | "CAJA" | "TARIMA";

export type IPresentacion = {
  presentacion_ID: string;
  presentacion_producto: string;
  presentacion_tipo: ITipoPresentacion;
  presentacion_codigo_barras: string;
  presentacion_cantidad: number;
};

export type IProductoJovany = {
  id_producto: number;
  codigo: string;
  nombre: string;
  fecha_registro: string;
  registro: number;
  estatus: number;
  linea: number;
  unidad: number;
  ums: number;
  code: string | null;
  imagen: number;
};
