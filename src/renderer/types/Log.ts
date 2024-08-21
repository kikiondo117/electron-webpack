// Función de helper para asegurarte de que nunca se llega a este punto
export function assertUnreachable(x: never): never {
  throw new Error(`Unhandled case: ${x}`);
}
