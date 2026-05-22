interface Env {
  AUTOFIN_SIMULATION_TOKEN?: string;
  AUTOFIN_SIMULATION_URL?: string;
}

const DEFAULT_AUTOFIN_URL = 'https://fabdigital02.autofin.cl/autofin/api/cuota-trinidad/v1';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.AUTOFIN_SIMULATION_TOKEN) {
    return Response.json({ message: 'Falta AUTOFIN_SIMULATION_TOKEN.' }, { status: 503 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: 'Solicitud invalida.' }, { status: 400 });
  }

  const url = new URL(env.AUTOFIN_SIMULATION_URL || DEFAULT_AUTOFIN_URL);
  url.searchParams.set('token', env.AUTOFIN_SIMULATION_TOKEN);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
