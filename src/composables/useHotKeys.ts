type HotkeyHandler = (event: KeyboardEvent) => void;

interface HotkeyOptions {
  /** Evita que el evento siga propagándose */
  preventDefault?: boolean;
  /** Sensible o no a mayúsculas/minúsculas */
  caseSensitive?: boolean;
}

/**
 * Composable para escuchar hotkeys dentro de un componente.
 *
 * @param keys Lista de teclas que disparan la acción (ej: ["Control", "s"])
 * @param callback Función a ejecutar cuando se presiona la combinación
 * @param options Opciones adicionales
 */
export function useHotkeys(
  keys: string[],
  callback: HotkeyHandler,
  options: HotkeyOptions = { caseSensitive: false, preventDefault: true }
) {
  let pressedKeys = new Set<string>();

  const handler = (event: KeyboardEvent) => {
    const key = options.caseSensitive ? event.key : event.key.toLowerCase();
    pressedKeys.add(key);

    const requiredKeys = options.caseSensitive
      ? keys
      : keys.map((k) => k.toLowerCase());

    const allPressed =
      requiredKeys.every((k) => pressedKeys.has(k)) &&
      pressedKeys.size === requiredKeys.length;

    if (allPressed) {
      if (options.preventDefault) event.preventDefault();
      callback(event);
    }
  };

  const clearKey = (event: KeyboardEvent) => {
    const key = options.caseSensitive ? event.key : event.key.toLowerCase();
    pressedKeys.delete(key);
  };

  const add = () => {
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", clearKey);
  };

  const remove = () => {
    // console.log('HOT KEY DESTRUIDA ', keys);
    window.removeEventListener("keydown", handler);
    window.removeEventListener("keyup", clearKey);
    pressedKeys.clear();
  };

  // Agregamos y retornamos la función para desuscribir
  add();
  return remove;
}
