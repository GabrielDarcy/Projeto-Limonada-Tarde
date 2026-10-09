function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function atualizarDataAtual() {
  const botaoData = document.getElementById("dateButton");
  if (!botaoData) return;

  const agora = new Date();
  const dia = agora.getDate();
  const mes = capitalize(agora.toLocaleDateString("pt-BR", { month: "long" }));
  const ano = agora.getFullYear();

  botaoData.textContent = `${dia} de ${mes} de ${ano}`;
}

atualizarDataAtual();
setInterval(atualizarDataAtual, 60000);
fetch("planilha.xlsx")
  .then((resposta) => {
    console.log("PLANILHA ENCONTRADA");

    return resposta.arrayBuffer();
  })
  .then((dados) => {
    const workbook = XLSX.read(dados, {
      cellDates: true,
    });

    const nomeDaPlanilha = workbook.SheetNames[0];

    const planilha = workbook.Sheets[nomeDaPlanilha];

    const doacoes = XLSX.utils.sheet_to_json(planilha);

    console.log("DADOS DA PLANILHA:");
    console.log(doacoes);

    let totalPix = 0;

    doacoes.forEach((doacao) => {
      totalPix += Number(doacao.Valor) || 0;
    });

    const cardsResumo = document.querySelectorAll(".summary-card");

    if (cardsResumo.length > 0) {
      const valorPix = cardsResumo[0].querySelector("h2");

      valorPix.textContent = totalPix.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }

    if (cardsResumo.length > 1) {
      const quantidadeDoacoes = cardsResumo[1].querySelector("h2");

      quantidadeDoacoes.textContent = doacoes.length;
    }

    const totalRelatorio = document.querySelector(".report-total");

    if (totalRelatorio) {
      totalRelatorio.textContent = `${doacoes.length} doações`;
    }

    const listaDoacoes = document.querySelector(".donations-list");

    if (!listaDoacoes) {
      console.error("Não encontrei .donations-list no HTML.");

      return;
    }

    listaDoacoes.replaceChildren();

    doacoes.forEach((doacao, index) => {
      const nome =
        doacao["Nome completo"] || doacao.Nome || "Nome não informado";

      const tipo = doacao["Tipo de doação"] || "Não informado";

      const telefone = doacao.Telefone || "Não informado";

      const email = doacao["E-mail"] || doacao.Email || "Não informado";

      const quantidade = doacao.Quantidade || "Não informado";

      const local = doacao["Local da entrega"] || "Não informado";

      const observacao = doacao.Observação || "Nenhuma observação";

      const card = document.createElement("div");

      card.classList.add("donation-card");

      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";

      checkbox.id = `doacao${index + 1}`;

      checkbox.classList.add("donation-toggle");

      const header = document.createElement("div");

      header.classList.add("donation-header");

      const icone = document.createElement("div");

      icone.classList.add("donation-icon");

      icone.textContent = nome.charAt(0).toUpperCase();

      const basic = document.createElement("div");

      basic.classList.add("donation-basic");

      const nomeElemento = document.createElement("strong");

      nomeElemento.classList.add("donation-nome");

      nomeElemento.textContent = nome;

      const tipoElemento = document.createElement("span");

      tipoElemento.classList.add("donation-tipo");

      tipoElemento.textContent = tipo;

      basic.appendChild(nomeElemento);

      basic.appendChild(tipoElemento);

      const quantidadeDiv = document.createElement("div");

      quantidadeDiv.classList.add("donation-quantity");

      const quantidadeElemento = document.createElement("strong");

      quantidadeElemento.classList.add("donation-quantidade");

      quantidadeElemento.textContent = quantidade;

      const quantidadeTexto = document.createElement("span");

      quantidadeTexto.textContent = "quantidade";

      quantidadeDiv.appendChild(quantidadeElemento);

      quantidadeDiv.appendChild(quantidadeTexto);

      const botao = document.createElement("label");

      botao.htmlFor = `doacao${index + 1}`;

      botao.classList.add("donation-button");

      const verMais = document.createElement("span");

      verMais.classList.add("more");

      verMais.textContent = "Ver mais ↓";

      const verMenos = document.createElement("span");

      verMenos.classList.add("less");

      verMenos.textContent = "Ver menos ↑";

      botao.appendChild(verMais);

      botao.appendChild(verMenos);

      header.appendChild(icone);

      header.appendChild(basic);

      header.appendChild(quantidadeDiv);

      header.appendChild(botao);

      const detalhes = document.createElement("div");

      detalhes.classList.add("donation-details");

      function criarDetalhe(titulo, valor, classe) {
        const detalhe = document.createElement("div");

        detalhe.classList.add("detail");

        const tituloElemento = document.createElement("span");

        tituloElemento.textContent = titulo;

        const valorElemento = document.createElement("strong");

        valorElemento.classList.add(classe);

        valorElemento.textContent = valor;

        detalhe.appendChild(tituloElemento);

        detalhe.appendChild(valorElemento);

        return detalhe;
      }

      detalhes.appendChild(criarDetalhe("Nome completo", nome, "detail-nome"));

      detalhes.appendChild(
        criarDetalhe("Telefone", telefone, "detail-telefone"),
      );

      detalhes.appendChild(criarDetalhe("E-mail", email, "detail-email"));

      detalhes.appendChild(criarDetalhe("Tipo de doação", tipo, "detail-tipo"));

      detalhes.appendChild(
        criarDetalhe("Quantidade", quantidade, "detail-quantidade"),
      );

      detalhes.appendChild(
        criarDetalhe("Local da entrega", local, "detail-local"),
      );

      const observacaoElemento = criarDetalhe(
        "Observação",
        observacao,
        "detail-observacao",
      );

      observacaoElemento.classList.add("observation");

      detalhes.appendChild(observacaoElemento);

      card.appendChild(checkbox);

      card.appendChild(header);

      card.appendChild(detalhes);

      listaDoacoes.appendChild(card);
    });

    console.log("RELATÓRIO PREENCHIDO COM SUCESSO!");
  })
  .catch((erro) => {
    console.error("ERRO AO CARREGAR A PLANILHA:", erro);
  });
