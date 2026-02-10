/**
 * Busca y retorna el color basado en el nombre del evento
 * @param eventName - Nombre del evento
 * @returns String con el color en formato RGB (ej: "175, 109, 237")
 */
export const searchEventColor = (eventName: string): string => {
  if (eventName.includes("individual")) {
    return "175, 109, 237";
  }

  if (eventName.includes("pareja")) {
    return "175, 109, 237";
  }

  if (eventName.includes("situacional")) {
    return "254, 164, 90";
  }

  if (eventName.includes("Taller")) {
    return "40, 215, 133";
  }

  if (eventName.includes("Seminario")) {
    return "88, 155, 255";
  }

  if (eventName.includes("Sesión")) {
    return "249, 79, 79";
  }

  if (eventName.includes("Comunidad")) {
    return "0, 124, 124";
  }

  return "148, 163, 184";
};

export const shouldHideButton = (eventName: string, teachersCount: number): boolean => {
  if (eventName.includes("individual") && teachersCount === 1) {
    return true;
  }
  if (eventName.includes("pareja") && teachersCount === 2) {
    return true;
  }

  return false;
};
