import { IPresentacion, IProductos, IUsuarios } from "./db";

export type IProductoConPresentaciones = IProductos & {
  presentaciones: IPresentacion[];
};

export type ILoginUsuario = Pick<
  IUsuarios,
  "usuario_ID" | "usuario_nick" | "usuario_creacion"
>;
