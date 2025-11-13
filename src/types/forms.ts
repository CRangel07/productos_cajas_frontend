export type DataProducto = {
  codigo: string;
  codigoCaja: string;
  piezasCaja: number | null;
  descripcion: string;
  pasillo: number | null;
  piso: number | null;
  listo: boolean | null;
  jovanyID?: number | null;
};

export type ITipoPresentacion =
  | "PIEZA"
  | "CAJA"
  | "TARIMA"
  | "BULTO"
  | "BOLSA"
  | "PAQUETE"
  | "EXHIBIDOR";

export const ArrPresentaciones = [
  "PIEZA",
  "CAJA",
  "TARIMA",
  "BULTO",
  "BOLSA",
  "PAQUETE",
  "EXHIBIDOR",
];

export type IFormPresentacion = {
  idProducto: string | null;
  codigo: string | null;
  tipo: ITipoPresentacion | null;
  cantidad: number | null;
};

export type IFormProducto = {
  codigo: string | null;
  descripcion: string | null;
  linea: string | null | number;
};
