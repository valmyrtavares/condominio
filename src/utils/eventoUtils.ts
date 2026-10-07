import { EventoCondominio } from '../types';

/**
 * Faz o parsing de string de data (DD/MM/YYYY ou YYYY-MM-DD)
 * e do horário (ex: "19:00", "14:00 às 18:00", "14h - 18h30")
 * retornando a data/hora inicial e final estimadas.
 */
export function parseEventoDateTime(dataStr: string, horarioStr?: string): { start: Date; end: Date; isValid: boolean } {
  if (!dataStr || typeof dataStr !== 'string') {
    return { start: new Date(0), end: new Date(0), isValid: false };
  }

  const cleanData = dataStr.trim();
  let year = 0;
  let month = 0;
  let day = 0;

  if (cleanData.includes('/')) {
    const parts = cleanData.split('/');
    if (parts.length >= 3) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // 0-indexed
      year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
    }
  } else if (cleanData.includes('-')) {
    const parts = cleanData.split('-');
    if (parts.length >= 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    }
  }

  if (!year || isNaN(year) || isNaN(month) || isNaN(day)) {
    return { start: new Date(0), end: new Date(0), isValid: false };
  }

  let startHour = 0;
  let startMin = 0;
  let endHour = 23;
  let endMin = 59;
  let hasSpecificEndTime = false;

  if (horarioStr && typeof horarioStr === 'string' && horarioStr.trim()) {
    const h = horarioStr.toLowerCase().replace(/[^\d:ahàs\-–—]/g, ' ').trim();
    
    // Procura padrões com separadores de intervalo: "14:00 às 18:00", "14:00 - 18:00", "14h as 18h"
    const rangeMatch = h.match(/(\d{1,2})(?:[:h](\d{2}))?\s*(?:às|as|a|\-|–|—|ate|até)\s*(\d{1,2})(?:[:h](\d{2}))?/);
    if (rangeMatch) {
      startHour = parseInt(rangeMatch[1], 10);
      startMin = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : 0;
      endHour = parseInt(rangeMatch[3], 10);
      endMin = rangeMatch[4] ? parseInt(rangeMatch[4], 10) : 0;
      hasSpecificEndTime = true;
    } else {
      // Horário único: "19:00", "20h", "19h30"
      const singleMatch = h.match(/(\d{1,2})(?:[:h](\d{2}))?/);
      if (singleMatch) {
        startHour = parseInt(singleMatch[1], 10);
        startMin = singleMatch[2] ? parseInt(singleMatch[2], 10) : 0;
        // Se só tem horário de início, consideramos que o evento dura até o final daquele dia (23:59:59)
        // para garantir que os moradores ainda tenham acesso às informações durante o evento.
        endHour = 23;
        endMin = 59;
      }
    }
  }

  const startDate = new Date(year, month, day, startHour, startMin, 0, 0);
  const endDate = new Date(year, month, day, endHour, endMin, hasSpecificEndTime ? 0 : 59, 999);

  return {
    start: startDate,
    end: endDate,
    isValid: !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())
  };
}

/**
 * Retorna se um evento já terminou com base na data/hora atual.
 */
export function isEventoPassado(evento: Pick<EventoCondominio, 'data' | 'horario'>, agora: Date = new Date()): boolean {
  const { end, isValid } = parseEventoDateTime(evento.data, evento.horario);
  if (!isValid) return false;
  return agora.getTime() > end.getTime();
}

/**
 * Retorna se o evento está acontecendo hoje.
 */
export function isEventoHoje(evento: Pick<EventoCondominio, 'data'>, agora: Date = new Date()): boolean {
  const { start, isValid } = parseEventoDateTime(evento.data);
  if (!isValid) return false;
  return (
    start.getFullYear() === agora.getFullYear() &&
    start.getMonth() === agora.getMonth() &&
    start.getDate() === agora.getDate()
  );
}

/**
 * Separa a lista de eventos em "Próximos / Atuais" e "Passados / Encerrados",
 * ordenando os próximos por data crescente (mais próximos primeiro)
 * e os passados por data decrescente (mais recentes primeiro).
 */
export function separarEventosPorStatus(
  eventos: EventoCondominio[],
  agora: Date = new Date()
): { proximos: EventoCondominio[]; passados: EventoCondominio[] } {
  const proximos: EventoCondominio[] = [];
  const passados: EventoCondominio[] = [];

  eventos.forEach((evt) => {
    if (isEventoPassado(evt, agora)) {
      passados.push(evt);
    } else {
      proximos.push(evt);
    }
  });

  // Ordenar próximos: mais cedo primeiro
  proximos.sort((a, b) => {
    const da = parseEventoDateTime(a.data, a.horario).start.getTime();
    const db = parseEventoDateTime(b.data, b.horario).start.getTime();
    return da - db;
  });

  // Ordenar passados: mais recentes primeiro
  passados.sort((a, b) => {
    const da = parseEventoDateTime(a.data, a.horario).end.getTime();
    const db = parseEventoDateTime(b.data, b.horario).end.getTime();
    return db - da;
  });

  return { proximos, passados };
}
