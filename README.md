# Sistema de Parceiros — Pousada do Barão

Sistema independente para cadastrar parceiros em um painel administrativo e exibi-los automaticamente no site da Pousada do Barão. A base de dados é uma planilha do Google Sheets.

## Estrutura

- `api-publica/`: endpoint somente leitura para o site público.
- `painel-admin/`: cadastro, edição, ativação, ordenação e exclusão de parceiros.
- `integracao-site/`: JavaScript que transforma os registros ativos em cards no site.

## Planilha utilizada

- ID: `1RkShJ9iy2DhVlPhtz5vB1yBPit89eCCtCk-eB9CC7PQ`
- Aba: `Parceiros`

As colunas precisam permanecer nesta ordem:

`ID`, `Nome`, `Categoria`, `Benefício`, `Descrição`, `Instagram`, `WhatsApp`, `Logo (URL)`, `Ordem`, `Ativo`, `Atualizado em`.

## 1. Publicar a API pública

1. Acesse [script.google.com](https://script.google.com) e crie um projeto chamado `API Parceiros — Pousada do Barão`.
2. Substitua o conteúdo de `Code.gs` pelo arquivo `api-publica/Code.gs` deste repositório.
3. Em **Configurações do projeto**, marque **Mostrar o arquivo de manifesto appsscript.json no editor**.
4. Substitua o manifesto pelo arquivo `api-publica/appsscript.json`.
5. Clique em **Implantar → Nova implantação → Aplicativo da Web**.
6. Configure **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**.
7. Autorize o projeto e copie a URL terminada em `/exec`.

Teste a URL em uma janela anônima. Ela deve retornar JSON com a chave `parceiros`.

## 2. Publicar o painel administrativo

1. Crie outro projeto chamado `Painel de Parceiros — Pousada do Barão`.
2. Use `painel-admin/Code.gs` como código principal.
3. Crie um arquivo HTML chamado exatamente `Index` e use o conteúdo de `painel-admin/Index.html`.
4. Exiba o manifesto e use `painel-admin/appsscript.json`.
5. Em `ADMIN_EMAILS`, mantenha somente as contas autorizadas.
6. Clique em **Implantar → Nova implantação → Aplicativo da Web**.
7. Configure **Executar como: Usuário que acessa o aplicativo** e **Quem pode acessar: Qualquer pessoa com uma Conta do Google**.
8. Autorize e copie a URL do painel.

O usuário do painel precisa ter permissão para editar a planilha.

## 3. Conectar ao site

1. Abra `integracao-site/parceiros-dinamicos.js`.
2. Substitua `COLE_AQUI_A_URL_DA_API_PUBLICA` pela URL `/exec` da API.
3. Envie o arquivo ao servidor junto dos demais recursos do site.
4. Na página de parceiros, mantenha o contêiner:

```html
<div id="partners-grid"></div>
<script src="/assets/js/parceiros-dinamicos.js" defer></script>
```

Os nomes das classes CSS foram mantidos genéricos para receber o design do site atual.

## Atualizações posteriores

Depois de alterar qualquer arquivo do Apps Script, use **Implantar → Gerenciar implantações → Editar → Nova versão**. Manter a mesma implantação preserva a URL `/exec`.

## Segurança

- A API pública não possui operações de escrita.
- O painel valida o e-mail autorizado antes de ler ou alterar registros.
- Não coloque senhas, tokens ou chaves privadas neste repositório.
- Desativar um parceiro é preferível a excluí-lo quando for necessário preservar o histórico.

