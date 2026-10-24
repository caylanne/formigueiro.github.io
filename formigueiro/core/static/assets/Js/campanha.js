/* ===== Formigueiro | Detalhes da Campanha ===== */
(function () {
  'use strict';

  // Troque por dados vindos da API/back-end quando existir.
  // Os ids são os mesmos usados na lista de campanhas (home.js).
  var CAMPANHAS = [
    {
      id: 1,
      ong: 'Mesa Solidária',
      titulo: 'Arrecadação de Arroz e Feijão',
      urgente: true,
      imagem: 'arroz-feijao.jpg',
      sobre: 'O projeto Mesa Solidária apoia mais de 20 famílias em situação de vulnerabilidade na cidade de Patos com cestas diárias.',
      endereco: 'Rua Ântonio Félix , 450 - São Sebastião, Patos',
      horario: 'De Segunda a Sexta, das 08:00 às 17:00',
      itens: [
        { nome: 'Arroz (Pacotes 1kg)', falta: 45, unidade: 'kg' },
        { nome: 'Feijão Carioca (Pacotes 1kg)', falta: 30, unidade: 'kg' }
      ]
    },
    {
      id: 2,
      ong: 'ONG Prato Cheio',
      titulo: 'Arrecadação de Óleo de Cozinha',
      urgente: false,
      imagem: 'oleo-cozinha.jpg',
      sobre: 'A ONG Prato Cheio distribui refeições e cestas básicas para famílias da região.',
      endereco: 'Sede da ONG Prato Cheio - Belo Horizonte, Patos',
      horario: 'De Segunda a Sexta, das 08:00 às 17:00',
      itens: [
        { nome: 'Óleo de cozinha soja (900ml)', falta: 10, unidade: ' garrafas' }
      ]
    },
    {
      id: 3,
      ong: 'ONG Prato Cheio',
      titulo: 'Arrecadação de Leite em Pó',
      urgente: false,
      imagem: 'leite-po.jpg',
      sobre: 'A ONG Prato Cheio distribui refeições e cestas básicas para famílias da região.',
      endereco: 'Sede da ONG Prato Cheio - Jatobá, Patos',
      horario: 'De Segunda a Sexta, das 08:00 às 17:00',
      itens: [
        { nome: 'Leite em pó integral (sachê)', falta: 60, unidade: ' sachês' }
      ]
    }
  ];

  // URLs injetadas pelo Django (data-attributes no #pagina)
  var CFG = document.getElementById('pagina').dataset;
  var URL_IMG = CFG.imgBase;
  var URL_DOAR = CFG.urlDoar;
  var URL_CRIAR = CFG.urlCriarCampanha;

  // Quem está vendo a página: ?de=ong (ONG) ou, sem parâmetro, doador.
  // Com login e back-end, isso deve vir da sessão do usuário.
  var ONG_LOGADA = 'ONG Prato Cheio';
  var params = new URLSearchParams(window.location.search);
  var ehOng = params.get('de') === 'ong';

  var PERFIL = ehOng
    ? {
        home: CFG.urlHomeOng,
        perfil: CFG.urlPerfilOng,
        nome: 'Prato Cheio',
        menu: [
          { texto: 'Campanhas', href: CFG.urlHomeOng, ativo: true },
          { texto: 'Painel da ONG', href: CFG.urlPainelOng },
          { texto: 'Criar Campanha', href: CFG.urlCriarCampanha }
        ]
      }
    : {
        home: CFG.urlHomeDoador,
        perfil: CFG.urlPerfilDoador,
        nome: 'Seu Nome',
        menu: [{ texto: 'Campanhas', href: CFG.urlHomeDoador, ativo: true }]
      };

  var ICONE_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>';
  var ICONE_LOCAL =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';

  function escapar(texto) {
    var div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  /* Cabeçalho e botão voltar de acordo com o perfil */
  document.getElementById('link-logo').href = PERFIL.home;
  document.getElementById('link-voltar').href = PERFIL.home;
  document.getElementById('link-perfil').href = PERFIL.perfil;
  document.getElementById('perfil-nome').textContent = PERFIL.nome;
  document.getElementById('menu').innerHTML = PERFIL.menu.map(function (item) {
    return '<a href="' + item.href + '"' + (item.ativo ? ' class="ativo" aria-current="page"' : '') + '>' +
      escapar(item.texto) + '</a>';
  }).join('');

  // Sem ?id na URL, mostra a primeira campanha (útil para visualizar a tela direto).
  var idParam = new URLSearchParams(window.location.search).get('id');
  var id = idParam === null ? CAMPANHAS[0].id : Number(idParam);
  var campanha = CAMPANHAS.filter(function (c) { return c.id === id; })[0];

  var pagina = document.getElementById('pagina');

  if (!campanha) {
    document.title = 'Campanha não encontrada | Formigueiro';
    ['imagem', 'sobre', 'resumo'].forEach(function (nome) {
      document.getElementById(nome).remove();
    });
    pagina.insertAdjacentHTML('beforeend',
      '<p class="nao-encontrada">Não encontramos essa campanha. ' +
      '<a href="' + PERFIL.home + '">Voltar para as campanhas</a></p>');
    return;
  }

  document.title = campanha.titulo + ' | Formigueiro';

  /* Imagem (se o arquivo não existir, fica o fundo degradê) */
  document.getElementById('imagem').innerHTML =
    '<img src="' + escapar(URL_IMG + campanha.imagem) + '" alt="' + escapar(campanha.titulo) + '" onerror="this.remove()">';

  /* Sobre a ONG + como entregar */
  document.getElementById('sobre').innerHTML =
    '<h2>Sobre a ONG</h2>' +
    '<p class="sobre-texto">' + escapar(campanha.sobre) + '</p>' +
    '<hr>' +
    '<h2>Como Entregar</h2>' +
    '<p class="endereco">' + ICONE_LOCAL + escapar(campanha.endereco) + '</p>' +
    '<p class="horario">' + escapar(campanha.horario) + '</p>';

  /* Resumo + itens */
  var itensPendentes = campanha.itens.filter(function (i) { return i.falta > 0; });

  var blocoItens = itensPendentes.length
    ? '<div class="itens"><h3>Itens mais necessários:</h3><ul>' +
      itensPendentes.map(function (i) {
        return '<li class="item">' + ICONE_CHECK +
          '<span class="item-nome">' + escapar(i.nome) + '</span>' +
          '<span class="item-falta">Faltam ' + i.falta + escapar(i.unidade) + '</span></li>';
      }).join('') + '</ul></div>'
    : '<p class="concluida">Meta atingida. Obrigado a todos que doaram!</p>';

  // Doador: "Quero Doar". ONG: só pode editar a própria campanha.
  var botao = '';
  if (!ehOng && itensPendentes.length) {
    botao = '<a class="botao" href="' + URL_DOAR + '?id=' + campanha.id + '">Quero Doar</a>';
  } else if (ehOng && campanha.ong === ONG_LOGADA) {
    botao = '<a class="botao" href="' + URL_CRIAR + '?id=' + campanha.id + '">Editar campanha</a>';
  }

  document.getElementById('resumo').innerHTML =
    '<div class="tags"><span class="tag tag-ong">' + escapar(campanha.ong) + '</span>' +
    (campanha.urgente ? '<span class="tag tag-urgente">Urgente</span>' : '') + '</div>' +
    '<h2>' + escapar(campanha.titulo) + '</h2>' +
    blocoItens + botao;
})();
