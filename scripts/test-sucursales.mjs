const API_URL = 'https://track.promobility.cl/api/locations/sucursales';
const SITE_ID = process.env.PROMOBILITY_API_SITE_ID || '6';
const TOKEN =
  process.env.PROMOBILITY_API_TOKEN ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb3RpemFjaW9uIiwibmFtZSI6ImVsIGNvbXBpIiwiaWF0IjoxNTE2MjM5MDIyfQ.vZx2EGuHxCJ2mYfUd9o1EnoDhTYzKgsMd-HJoDJEw2w';

function findValueByKeyPattern(data, patterns) {
  if (!data || typeof data !== 'object') return null;

  for (const [key, value] of Object.entries(data)) {
    const normalizedKey = key.toLowerCase();

    if (patterns.some((pattern) => pattern.test(normalizedKey)) && value !== null && value !== undefined && value !== '') {
      return value;
    }
  }

  return null;
}

function getBranches(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.sucursales)) return payload.sucursales;
  if (Array.isArray(payload?.locations)) return payload.locations;

  if (Array.isArray(payload?.regiones)) {
    return payload.regiones.flatMap((region) =>
      (region.communes || []).flatMap((commune) =>
        (commune.sucursales || []).map((branch) => ({
          ...branch,
          region: region.name,
          commune: commune.name,
        }))
      )
    );
  }

  return [];
}

async function main() {
  const url = new URL(API_URL);
  url.searchParams.set('id_web', SITE_ID);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Origin: 'cyclonemotos.cl',
    },
  });

  const payload = await response.json();
  const branches = getBranches(payload);

  console.log(`Status: ${response.status}`);
  console.log(`Sucursales encontradas: ${branches.length}`);
  console.log('');

  if (!branches.length) {
    console.log('Payload recibido:');
    console.dir(payload, { depth: null });
    return;
  }

  const branchesWithCoordinates = branches.filter((branch) => branch.latitude && branch.longitude);
  const branchesWithoutCoordinates = branches.filter((branch) => !branch.latitude || !branch.longitude);
  const uniqueBranches = Array.from(new Map(branches.map((branch) => [branch.id, branch])).values());
  const uniqueBranchesWithCoordinates = uniqueBranches.filter((branch) => branch.latitude && branch.longitude);
  const uniqueBranchesWithoutCoordinates = uniqueBranches.filter((branch) => !branch.latitude || !branch.longitude);

  console.log(`Con latitud/longitud: ${branchesWithCoordinates.length}`);
  console.log(`Sin latitud/longitud: ${branchesWithoutCoordinates.length}`);
  console.log(`Concesionarios unicos por id: ${uniqueBranches.length}`);
  console.log(`Unicos con latitud/longitud: ${uniqueBranchesWithCoordinates.length}`);
  console.log(`Unicos sin latitud/longitud: ${uniqueBranchesWithoutCoordinates.length}`);
  console.log('');

  branches.forEach((branch, index) => {
    const latitude = findValueByKeyPattern(branch, [/^lat$/, /latitud/, /latitude/]);
    const longitude = findValueByKeyPattern(branch, [/^lng$/, /^lon$/, /longitud/, /longitude/]);
    const name =
      branch.nombre ||
      branch.name ||
      branch.sucursal ||
      branch.razon_social ||
      branch.titulo ||
      `Sucursal ${index + 1}`;

    console.log(`${index + 1}. ${name}`);
    console.log(`   Zona: ${branch.region ?? 'Sin region'} / ${branch.commune ?? 'Sin comuna'}`);
    console.log(`   Direccion: ${branch.address ?? 'No viene'}`);
    console.log(`   Latitud: ${latitude ?? 'No viene'}`);
    console.log(`   Longitud: ${longitude ?? 'No viene'}`);
  });
}

main().catch((error) => {
  console.error('Error consultando sucursales:', error);
  process.exitCode = 1;
});
