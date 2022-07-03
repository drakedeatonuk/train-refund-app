export const prettyFormat = (...v: any[]) => v.map(v => JSON.stringify(v, null, 2));
export const print = (...v: any[]) => console.log(...prettyFormat(...v));
