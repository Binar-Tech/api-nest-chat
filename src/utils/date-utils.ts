// export function getActualDateTimeFormattedToFirebird() {
//   const now = new Date();

//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0'); // Ajuste do mês (0-based)
//   const day = String(now.getDate()).padStart(2, '0');
//   const hours = String(now.getHours()).padStart(2, '0');
//   const minutes = String(now.getMinutes()).padStart(2, '0');
//   const seconds = String(now.getSeconds()).padStart(2, '0');

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }
export function getActualDateTimeFormattedToFirebird() {
  const now = new Date();

  // Converte para o fuso horário de São Paulo
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '00';

  const year = get('year');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');
  const second = get('second');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
