import type { HomeOffer, HomeSliderMoto, Moto, Oferta, PromobilityMotoModel } from './types';

const DEFAULT_BASE_URL = 'https://track.promobility.cl/api/vehiculos/modelo';
const DEFAULT_SITE_ID = '6';
const DEFAULT_ORIGIN = 'cyclonemotos.cl';
const REQUEST_TIMEOUT_MS = 30_000;

export function normalizePrice(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const numericValue = Number.parseInt(trimmedValue.replace(/[^\d]/g, ''), 10);

  if (Number.isNaN(numericValue)) {
    return trimmedValue.replace(/,/g, '.');
  }

  return new Intl.NumberFormat('es-CL').format(numericValue);
}

function normalizeNumber(value?: string | null) {
  if (!value) {
    return 0;
  }

  const numericValue = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function getPromobilityConfig() {
  const token = import.meta.env.PROMOBILITY_API_TOKEN;

  if (!token) {
    throw new Error('Falta PROMOBILITY_API_TOKEN para consultar Promobility.');
  }

  return {
    baseUrl: import.meta.env.PROMOBILITY_API_BASE_URL || DEFAULT_BASE_URL,
    origin: import.meta.env.PROMOBILITY_API_ORIGIN || DEFAULT_ORIGIN,
    siteId: import.meta.env.PROMOBILITY_API_SITE_ID || DEFAULT_SITE_ID,
    token,
  };
}

export async function fetchPromobilityModelo(idVehiculo: string): Promise<PromobilityMotoModel> {
  const config = getPromobilityConfig();
  const url = new URL(config.baseUrl);
  url.searchParams.set('id_web', config.siteId);
  url.searchParams.set('id_vehiculo', idVehiculo);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Origin: config.origin,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  const rawBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Promobility devolvio ${response.status} para id_vehiculo=${idVehiculo}: ${rawBody.slice(0, 180)}`
    );
  }

  return JSON.parse(rawBody) as PromobilityMotoModel;
}

async function fetchPromobilityModelMap(ids: string[]) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  const apiEntries = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const model = await fetchPromobilityModelo(id);
        return [id, model] as const;
      } catch (error) {
        console.warn(
          `No se pudo consultar Promobility para la moto ${id}:`,
          error instanceof Error ? error.message : error
        );
        return [id, null] as const;
      }
    })
  );

  return new Map(apiEntries);
}

export async function buildHomeSliderMotos(motos: Moto[]): Promise<HomeSliderMoto[]> {
  const sliderMotos = motos.filter(
    (moto) => moto.apiMotoId && moto.slug && moto.imagenSliderHome?.asset?._ref
  );

  const apiById = await fetchPromobilityModelMap(sliderMotos.map((moto) => moto.apiMotoId!));

  return sliderMotos
    .map((moto) => {
      const apiModel = apiById.get(moto.apiMotoId!);
      const hasBonus = normalizeNumber(apiModel?.bono) > 0;

      if (!apiModel) {
        return null;
      }

      return {
        ...moto,
        apiModel,
        displayName: apiModel.modelo || moto.nombre,
        displayPrice: normalizePrice(apiModel.precio),
        displayListPrice: hasBonus ? normalizePrice(apiModel.precio_lista) : null,
        displayBonus: null,
      } as HomeSliderMoto;
    })
    .filter((moto) => moto !== null) as HomeSliderMoto[];
}

export async function buildHomeOffers(
  ofertas: Oferta[],
  fallbackMotos: Oferta[]
): Promise<HomeOffer[]> {
  const buildOffer = (oferta: Oferta, apiModel: PromobilityMotoModel): HomeOffer | null => {
    if (normalizeNumber(apiModel.bono) <= 0) return null;
    if (!oferta.imagenFondo?.asset?._ref) return null;
    return {
      ...oferta,
      imagenFondo: oferta.imagenFondo,
      apiModel,
      displayName: apiModel.modelo || `Moto ${oferta.apiMotoId}`,
      displayListPrice: normalizePrice(apiModel.precio_lista),
      displayBonus: normalizePrice(apiModel.bono),
    };
  };

  // Caso 1: hay entradas manuales en Sanity — filtrar las que tienen foto y bono
  if (ofertas.length > 0) {
    const withPhoto = ofertas.filter((o) => o.imagenFondo?.asset?._ref);
    const apiById = await fetchPromobilityModelMap(withPhoto.map((o) => o.apiMotoId));
    return withPhoto
      .map((oferta) => {
        const apiModel = apiById.get(oferta.apiMotoId);
        if (!apiModel) return null;
        return buildOffer(oferta, apiModel);
      })
      .filter((o): o is HomeOffer => Boolean(o));
  }

  // Caso 2: no hay entradas — traer todas las motos con fotoOferta y bono, elegir 2 al azar
  const withPhoto = fallbackMotos.filter((o) => o.imagenFondo?.asset?._ref);
  if (!withPhoto.length) return [];

  const apiById = await fetchPromobilityModelMap(withPhoto.map((o) => o.apiMotoId));
  const withBonus = withPhoto
    .map((oferta) => {
      const apiModel = apiById.get(oferta.apiMotoId);
      if (!apiModel) return null;
      return buildOffer(oferta, apiModel);
    })
    .filter((o): o is HomeOffer => Boolean(o));

  // Fisher-Yates shuffle para selección verdaderamente aleatoria
  for (let i = withBonus.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [withBonus[i], withBonus[j]] = [withBonus[j], withBonus[i]];
  }
  return withBonus.slice(0, 2);
}
