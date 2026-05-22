interface Env {
  PROMOBILITY_API_BASE_URL?: string;
  PROMOBILITY_API_ORIGIN?: string;
  PROMOBILITY_API_SITE_ID?: string;
  PROMOBILITY_API_TOKEN?: string;
}

const DEFAULT_BASE_URL = 'https://track.promobility.cl/api/vehiculos/modelo';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.PROMOBILITY_API_TOKEN) {
    return Response.json({ message: 'Falta PROMOBILITY_API_TOKEN.' }, { status: 503 });
  }

  const incomingUrl = new URL(request.url);
  const motoId = incomingUrl.searchParams.get('id_vehiculo');

  if (!motoId) {
    return Response.json({ message: 'Falta id_vehiculo.' }, { status: 400 });
  }

  const url = new URL(env.PROMOBILITY_API_BASE_URL || DEFAULT_BASE_URL);
  url.searchParams.set('id_web', incomingUrl.searchParams.get('id_web') || env.PROMOBILITY_API_SITE_ID || '6');
  url.searchParams.set('id_vehiculo', motoId);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.PROMOBILITY_API_TOKEN}`,
      Origin: env.PROMOBILITY_API_ORIGIN || 'cyclonemotos.cl',
    },
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};
