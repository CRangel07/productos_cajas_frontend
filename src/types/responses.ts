import { IPresentacion, IProductos } from "./db";

export type IProductoConPresentaciones = IProductos & {
  presentaciones: IPresentacion[];
};
