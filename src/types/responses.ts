import { ILinea, IPresentacion, IProductos, IUsuarios } from "./db";

export type IProductoConPresentaciones = IProductos & {
  presentaciones: IPresentacion[];
} & Pick<ILinea, "linea_descripcion" | "linea_compucaja_ID">;

export type ILoginUsuario = Pick<
  IUsuarios,
  "usuario_ID" | "usuario_nick" | "usuario_creacion"
>;
