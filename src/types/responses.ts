import { ILinea, IPresentacion, IProductos, IUsuarios } from "./db";

export type IProductoConPresentaciones = IProductos & {
  presentaciones: IPresentacion[];
} & Pick<ILinea, "linea_descripcion" | "linea_compucaja_ID">;

export type ILoginUsuario = Pick<
  IUsuarios,
  "usuario_ID" | "usuario_nick" | "usuario_creacion"
>;

export type ServerToClientEvents = {
  presentacionGuardada: (data: {
    presentacion: IPresentacion;
    producto: string;
    productoData: IProductoConPresentaciones; //  Esta desfasada ya que se obtuve antes de insertar la presentaicion
  }) => void;

  presentacionEliminada: (data: {
    presentacion: IPresentacion & Pick<IProductos, "producto_descripcion">;
  }) => void;

  productoStatus: (data: { producto: IProductos; status: 1 | 0 }) => void;
};

export type ClientToServerEvents = {
  mensaje: (mensaje: string) => void;
};
