const SHEET_ID = '1RkShJ9iy2DhVlPhtz5vB1yBPit89eCCtCk-eB9CC7PQ';
const TAB_NAME = 'Parceiros';
const SESSION_SECONDS = 21600;
const HEADERS = ['ID','Nome','Categoria','Benefício','Descrição','Instagram','WhatsApp','Logo (URL)','Ordem','Ativo','Atualizado em'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Parceiros — Pousada do Barão')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function login(password) {
  const saved = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD');
  if (!saved) throw new Error('Senha administrativa ainda não configurada.');
  if (String(password || '') !== saved) throw new Error('Senha incorreta.');
  const token = Utilities.getUuid();
  CacheService.getScriptCache().put('session:' + token, 'ok', SESSION_SECONDS);
  return {ok:true, token:token};
}

function logout(token) {
  if (token) CacheService.getScriptCache().remove('session:' + token);
  return {ok:true};
}

function assertSession_(token) {
  if (!token || CacheService.getScriptCache().get('session:' + token) !== 'ok') {
    throw new Error('Sessão expirada. Entre novamente.');
  }
}

function sheet_() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME);
  if (!sheet) throw new Error('A aba "' + TAB_NAME + '" não foi encontrada.');
  return sheet;
}

function listPartners(token) {
  assertSession_(token);
  const values = sheet_().getDataRange().getValues();
  values.shift();
  return values.filter(r => r[0]).map(r => Object.fromEntries(HEADERS.map((h,i) => [h,r[i]]))).sort((a,b) => Number(a.Ordem || 999) - Number(b.Ordem || 999));
}

function savePartner(token, data) {
  assertSession_(token);
  if (!data.Nome || !data['Benefício']) throw new Error('Preencha nome e benefício.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const values = sh.getDataRange().getValues();
    const id = data.ID || slug_(data.Nome) + '-' + Date.now().toString(36);
    const row = [id,data.Nome,data.Categoria||'',data['Benefício'],data['Descrição']||'',data.Instagram||'',data.WhatsApp||'',data['Logo (URL)']||'',Number(data.Ordem||999),data.Ativo !== false,new Date()];
    const found = values.findIndex((r,i) => i > 0 && String(r[0]) === String(id));
    if (found > 0) sh.getRange(found+1,1,1,HEADERS.length).setValues([row]); else sh.appendRow(row);
    return {ok:true,id:id};
  } finally {
    lock.releaseLock();
  }
}

function deletePartner(token, id) {
  assertSession_(token);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const values = sh.getDataRange().getValues();
    const found = values.findIndex((r,i) => i > 0 && String(r[0]) === String(id));
    if (found > 0) sh.deleteRow(found+1);
    return {ok:true};
  } finally {
    lock.releaseLock();
  }
}

function slug_(value) {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
