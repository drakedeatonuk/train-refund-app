export function simpleDateUK(date: Date, ): string {
  return new Date(date).toLocaleDateString('en-GB', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

export function simpleDateCanada(date: Date) {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function simpleTimeUK(date: Date): string {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
