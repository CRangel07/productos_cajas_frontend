import { DateTime } from "luxon";

export const formatDate = (
  fecha: string | null,
  formato: string = "dd/LL/yy hh:mm a"
): string => {
  if (!fecha) return "";

  // Detectar si la cadena incluye microsegundos (punto seguido de números)
  const tieneMicrosegundos = /\.\d+$/.test(fecha);

  if (tieneMicrosegundos) fecha = fecha.slice(0, 19);

  const dt = DateTime.fromFormat(fecha, "yyyy-LL-dd HH:mm:ss", {
    zone: "America/Mexico_City",
  });

  // Validar por si acaso
  if (!dt.isValid) {
    console.warn("⚠️ Fecha inválida:", fecha);
    return fecha;
  }

  return dt.setZone("America/Mexico_City").setLocale("es-MX").toFormat(formato);
};

export const getFecha = () => {
  return DateTime.now().setZone("America/Mexico_City").setLocale("es-MX");
};
