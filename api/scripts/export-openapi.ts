const res = await fetch('http://localhost:8080/docs/openapi.json');
if (!res.ok) throw new Error(`Gagal ambil spec: ${res.status}`);
const json = await res.json();
await Bun.write('docs/openapi.json', JSON.stringify(json, null, 2));
console.log('✅ OpenAPI diekspor -> backend/explorer/api/docs/openapi.json');


// bun --filter explorer-api run scripts/export-openapi.ts