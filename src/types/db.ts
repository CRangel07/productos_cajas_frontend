export type IProductos = {
  producto_ID: string;
  producto_id_jovas: number | null;
  producto_descripcion: string;
  producto_pasillo: number;
  producto_rack_nivel: number;
  producto_registro: string;
  producto_listo: 1 | 0 | boolean
};

export type ITipoPresentacion = "PIEZA" | "CAJA" | "TARIMA";

export type ITipoCodigo = "UPC-A" | "EAN-13" | "EAN-14" | "EAN-8";

export type IPresentacion = {
  presentacion_ID: string;
  presentacion_producto: string;
  presentacion_tipo: ITipoPresentacion;
  presentacion_codigo_barras: string;
  presentacion_cantidad: number;
  presentacion_tipo_codigo: ITipoCodigo | null;
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

export type IUsuarios = {
  usuario_ID: number;
  usuario_nick: string;
  usuario_password: string;
  usuario_creacion: string;
};

export type ILinea = {
  linea_ID: number
  linea_compucaja_ID: string
  linea_descripcion: string
}