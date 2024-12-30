export interface Output {
  _time: Date;
}

const allow = "https://lyp.ink";
export const root = { "Access-Control-Allow-Origin": `${allow}` };

export const TextResp = (data: string, status: number | 200) => {
  return new Response(data, {
    status: status,
    headers: { ...root },
  });
};

export const JsonResp = (data: Output, status: number | 200) => {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...root },
  });
};
