/* ===== Formigueiro | Registrar Doação ===== */
(function () {
  'use strict';

  // Troque por dados vindos da API/back-end quando existir.
  // Os ids são os mesmos de home.js e campanha.js; `max` é quanto ainda falta de cada item.
  var CAMPANHAS = [
    {
      id: 1,
      titulo: 'Mesa Solidária • Patos',
      texto: 'O projeto Mesa Solidária apoia famílias carentes. Suas doações agendadas ajudam na logística e preparação de cestas e refeições semanais.',
      itens: [
        { nome: 'Arroz (Pacote 1kg)', max: 45 },
        { nome: 'Feijão Carioca (Pacote 1kg)', max: 30 }
      ]
    },
    {
      id: 2,
      titulo: 'ONG Prato Cheio • Patos',
      texto: 'A ONG Prato Cheio distribui refeições e cestas básicas para famílias da região.',
      itens: [{ nome: 'Óleo de cozinha soja (900ml)', max: 10 }]
    },
    {
      id: 3,
      titulo: 'ONG Prato Cheio • Patos',
      texto: 'A ONG Prato Cheio distribui refeições e cestas básicas para famílias da região.',
      itens: [{ nome: 'Leite em pó integral (sachê)', max: 60 }]
    }
  ];

  var HORARIOS = ['09:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'];
  var DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  var MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  var QTD_MINIMA = 1;
  var DIAS_DISPONIVEIS = 14;

  var pagina = document.getElementById('pagina');
  // URLs injetadas pelo Django (data-attributes no #pagina)
  var CFG = pagina.dataset;
  var form = document.getElementById('form-doacao');
  var selItem = document.getElementById('item');
  var selDia = document.getElementById('dia');
  var selHorario = document.getElementById('horario');
  var elQtd = document.getElementById('qtd-valor');
  var btnMenos = document.getElementById('qtd-menos');
  var btnMais = document.getElementById('qtd-mais');
  var elMensagem = document.getElementById('mensagem-form');
  var botao = form.querySelector('.botao');

  var quantidade = QTD_MINIMA;
  var campanha = null;

  function escapar(texto) {
    var div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  function opcoes(lista) {
    return lista.map(function (t) {
      return '<option value="' + escapar(t.valor) + '">' + escapar(t.texto) + '</option>';
    }).join('');
  }

  // Sem ?id na URL, usa a primeira campanha (útil para visualizar a tela direto).
  var idParam = new URLSearchParams(window.location.search).get('id');
  var id = idParam === null ? CAMPANHAS[0].id : Number(idParam);
  campanha = CAMPANHAS.filter(function (c) { return c.id === id; })[0];

  if (!campanha) {
    document.title = 'Campanha não encontrada | Formigueiro';
    pagina.innerHTML = '<p class="nao-encontrada">Não encontramos essa campanha. ' +
      '<a href="' + CFG.urlHomeDoador + '">Voltar para as campanhas</a></p>';
    return;
  }

  /* ---------- Preenche a tela ---------- */
  document.getElementById('link-voltar').href = CFG.urlCampanha + '?id=' + campanha.id;
  document.getElementById('campanha-titulo').textContent = campanha.titulo;
  document.getElementById('campanha-texto').textContent = campanha.texto;

  selItem.innerHTML = opcoes(campanha.itens.map(function (i, n) {
    return { valor: String(n), texto: i.nome };
  }));

  var hoje = new Date();
  var dias = [];
  for (var d = 1; d <= DIAS_DISPONIVEIS; d++) {
    var data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + d);
    var iso = data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0') + '-' + String(data.getDate()).padStart(2, '0');
    dias.push({
      valor: iso,
      texto: DIAS_SEMANA[data.getDay()] + ', ' + data.getDate() + ' ' + MESES[data.getMonth()]
    });
  }
  selDia.innerHTML = opcoes(dias);
  selHorario.innerHTML = opcoes(HORARIOS.map(function (h) { return { valor: h, texto: h }; }));

  /* ---------- Quantidade ---------- */
  function itemAtual() { return campanha.itens[Number(selItem.value)]; }

  function renderQuantidade() {
    var max = itemAtual().max;
    if (quantidade > max) quantidade = max;
    if (quantidade < QTD_MINIMA) quantidade = QTD_MINIMA;
    elQtd.textContent = quantidade + (quantidade === 1 ? ' Unidade' : ' Unidades');
    btnMenos.disabled = quantidade <= QTD_MINIMA;
    btnMais.disabled = quantidade >= max;
  }

  btnMenos.addEventListener('click', function () { quantidade -= 1; renderQuantidade(); });
  btnMais.addEventListener('click', function () { quantidade += 1; renderQuantidade(); });

  selItem.addEventListener('change', function () {
    quantidade = QTD_MINIMA;
    renderQuantidade();
  });

  /* ---------- Envio ---------- */
  function aviso(tipo, texto) {
    elMensagem.className = 'aviso ' + tipo;
    elMensagem.textContent = texto;
    elMensagem.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    elMensagem.hidden = true;

    var item = itemAtual();
    if (quantidade < QTD_MINIMA || quantidade > item.max) {
      document.getElementById('erro-quantidade').textContent =
        'Escolha uma quantidade entre ' + QTD_MINIMA + ' e ' + item.max + '.';
      return;
    }
    document.getElementById('erro-quantidade').textContent = '';

    var doacao = {
      campanhaId: campanha.id,
      item: item.nome,
      quantidade: quantidade,
      entrega: form.entrega.value, // "levar" ou "coletar"
      dia: selDia.value,
      horario: selHorario.value
    };

    botao.disabled = true;
    botao.textContent = 'Registrando...';

    // TODO: enviar `doacao` para o back-end (fetch POST) quando a API existir.
    console.log('Doação pronta para enviar:', doacao);

    setTimeout(function () {
      aviso('sucesso', 'Doação registrada! A ONG foi avisada. Redirecionando...');
      setTimeout(function () { window.location.href = CFG.urlHomeDoador; }, 1500);
    }, 600);
  });

  renderQuantidade();
})();
