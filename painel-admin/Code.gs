const SHEET_ID = '1RkShJ9iy2DhVlPhtz5vB1yBPit89eCCtCk-eB9CC7PQ';
const TAB_NAME = 'Parceiros';
const ADMIN_EMAILS = ['luizfelipedsf@gmail.com'];
const HEADERS = ['ID','Nome','Categoria','Benefício','Descrição','Instagram','WhatsApp','Logo (URL)','Ordem','Ativo','Atualizado em'];

function assertAdmin_() {
  const email = Session.getActiveUser().getEmail().toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) throw new Error('Acesso não autorizado.');
  return email;
}
function sheet_() { return SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME); }
function doGet() { assertAdmin_(); return HtmlService.createHtmlOutputFromFile('Index').setTitle('Parceiros — Pousada do Barão').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); }
function listPartners() {
  assertAdmin_();
  const values = sheet_().getDataRange().getValues(); values.shift();
  return values.filter(r => r[0]).map(r => Object.fromEntries(HEADERS.map((h,i)=>[h,r[i]]))).sort((a,b)=>Number(a.Ordem||999)-Number(b.Ordem||999));
}
function savePartner(data) {
  assertAdmin_();
  if (!data.Nome || !data['Benefício']) throw new Error('Preencha nome e benefício.');
  const sh = sheet_(); const values = sh.getDataRange().getValues();
  const id = data.ID || slug_(data.Nome) + '-' + Date.now().toString(36);
  const row = [id,data.Nome,data.Categoria||'',data['Benefício'],data['Descrição']||'',data.Instagram||'',data.WhatsApp||'',data['Logo (URL)']||'',Number(data.Ordem||999),data.Ativo !== false,new Date()];
  const found = values.findIndex((r,i)=>i>0 && String(r[0])===String(id));
  if (found > 0) sh.getRange(found+1,1,1,HEADERS.length).setValues([row]); else sh.appendRow(row);
  return {ok:true,id};
}
function deletePartner(id) {
  assertAdmin_(); const sh=sheet_(); const values=sh.getDataRange().getValues();
  const found=values.findIndex((r,i)=>i>0 && String(r[0])===String(id));
  if(found>0) sh.deleteRow(found+1); return {ok:true};
}
function slug_(value){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

