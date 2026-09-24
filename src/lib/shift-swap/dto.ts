import type { Turno } from "shift-swap";

export function toTurnoDTO(turno: Turno) {
  return {
    id: turno.id,
    data: turno.data,
    horaInicio: turno.horaInicio,
    horaFim: turno.horaFim,
    funcionarioId: turno.funcionarioId,
  };
}
