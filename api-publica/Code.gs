const SHEET_ID = '1RkShJ9iy2DhVlPhtz5vB1yBPit89eCCtCk-eB9CC7PQ';
const TAB_NAME = 'Parceiros';

function doGet() {
  const rows = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME).getDataRange().getValues();
  const headers = rows.shift();
  const data = rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])))
    .filter(p => p.Ativo === true || String(p.Ativo).toUpperCase() === 'TRUE')
    .sort((a, b) => Number(a.Ordem || 999) - Number(b.Ordem || 999))
    .map(p => ({
      id: p.ID, nome: p.Nome, categoria: p.Categoria, beneficio: p['Benefício'],
      descricao: p['Descrição'], instagram: p.Instagram, whatsapp: p.WhatsApp,
      logo: p['Logo (URL)'], ordem: p.Ordem
    }));
  return ContentService.createTextOutput(JSON.stringify({ parceiros: data, atualizadoEm: new Date().toISOString() }))
    .setMimeType(ContentService.MimeType.JSON);
}

