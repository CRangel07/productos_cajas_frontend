import { DateTime } from "luxon";

export const formatDate = (
  fecha: string,
  formato: string = "dd/LL/yy hh:mm a"
) => {
  return DateTime.fromFormat(fecha, "yyyy-LL-dd HH:mm:ss", {
    zone: "America/Mexico_City",
  })
    .setZone("America/Mexico_City")
    .setLocale("es-MX")
    .toFormat(formato);
};
