interface Env {
  COTIZACION_API_BASE_URL?: string;
  PUBLIC_COTIZACION_API_BASE_URL?: string;
  PROMOBILITY_API_BASE_URL?: string;
  PROMOBILITY_API_ORIGIN?: string;
  PROMOBILITY_API_TOKEN?: string;
}

const DEFAULT_COTIZACION_API_BASE_URL = 'https://track.promobility.cl/api';

function cotizacionBaseUrl(env: Env) {
  if (env.COTIZACION_API_BASE_URL || env.PUBLIC_COTIZACION_API_BASE_URL) {
    return env.COTIZACION_API_BASE_URL || env.PUBLIC_COTIZACION_API_BASE_URL || DEFAULT_COTIZACION_API_BASE_URL;
  }

  if (!env.PROMOBILITY_API_BASE_URL) return DEFAULT_COTIZACION_API_BASE_URL;

  const url = new URL(env.PROMOBILITY_API_BASE_URL);
  url.pathname = url.pathname.replace(/\/vehiculos\/modelo\/?$/, '');
  return url.toString().replace(/\/$/, '');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.PROMOBILITY_API_TOKEN) {
    return Response.json({ mensaje: 'Falta PROMOBILITY_API_TOKEN.' }, { status: 503 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ mensaje: 'Solicitud invalida.' }, { status: 400 });
  }

  const baseUrl = cotizacionBaseUrl(env);
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/financiamiento`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.PROMOBILITY_API_TOKEN}`,
      'Content-Type': 'application/json',
      Origin: env.PROMOBILITY_API_ORIGIN || 'cyclonemotos.cl',
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
