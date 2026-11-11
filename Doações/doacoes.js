const URL_GOOGLE_SHEETS =
    "https://script.google.com/macros/s/AKfycbx-31vh3_OJSmO7tWVl0U_LA27rAWR_--sgP8WEoZMuD8haNgCz--U-VevLPXySbCj1/exec";

const elemento = (id) => document.getElementById(id);
const valor = (id) => elemento(id)?.value || "";

function exibir(id, display) {
    const alvo = elemento(id);
    if (alvo) alvo.style.display = display;
}

function definirObrigatorio(ids, obrigatorio) {
    ids.forEach((id) => {
        const campo = elemento(id);
        if (campo) campo.required = obrigatorio;
    });
}

function lerDadosDoacao() {
    return {
        nome: valor("nome"),
        email: valor("email"),
        telefone: valor("telefone"),
        endereco: valor("endereco"),
        tipoDoacao: valor("tipoDoacao"),
        descricao: valor("descricao"),
        observacoes: valor("observacoes"),
        localEntrega: valor("localEntrega")
    };
}

function abrirDoacao(id) {
    document.querySelectorAll(".donation-content").forEach((conteudo) => {
        if (conteudo.id !== id) conteudo.style.display = "none";
    });

    const conteudo = elemento(id);
    if (!conteudo) return;

    conteudo.style.display =
        conteudo.style.display === "block" ? "none" : "block";
}

function selecionarDoacao(tipo) {
    const campoTipo = elemento("tipoDoacao");
    if (!campoTipo) return;

    campoTipo.value = tipo;
    atualizarCamposDoacao();
    document.querySelector(".donation-form-area")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function atualizarCamposDoacao() {
    const tipo = elemento("tipoDoacao");
    if (!tipo) return;

    if (tipo.value === "") {
        exibir("donationForm", "none");
        exibir("pixBox", "none");
        exibir("formPlaceholder", "block");
        return;
    }

    if (tipo.value === "Doação financeira") {
        exibir("donationForm", "none");
        exibir("formPlaceholder", "none");
        exibir("pixBox", "block");
        definirObrigatorio(["descricao", "observacoes", "localEntrega"], false);
        return;
    }

    exibir("donationForm", "block");
    exibir("formPlaceholder", "none");
    exibir("pixBox", "none");
    definirObrigatorio(["descricao", "localEntrega"], true);
    definirObrigatorio(["observacoes"], false);
}

function copiarPix() {
    const chave = elemento("pixKey")?.textContent.trim();
    if (!chave) return;

    if (chave === "SUA-CHAVE-PIX-AQUI") {
        alert("Configure a chave PIX da Thermal Express no HTML antes de utilizar este botão.");
        return;
    }

    navigator.clipboard.writeText(chave)
        .then(() => alert("Chave PIX copiada!"))
        .catch(() => alert("Não foi possível copiar automaticamente. Copie a chave manualmente."));
}

const formularioDoacao = elemento("donationForm");

if (formularioDoacao) {
    formularioDoacao.addEventListener("submit", (event) => {
        event.preventDefault();

        const dados = lerDadosDoacao();
        const camposResumo = {
            nome: "resumoNome",
            email: "resumoEmail",
            telefone: "resumoTelefone",
            endereco: "resumoEndereco",
            tipoDoacao: "resumoTipo",
            descricao: "resumoDescricao",
            localEntrega: "resumoEntrega",
            observacoes: "resumoObservacoes"
        };

        Object.entries(camposResumo).forEach(([campo, id]) => {
            const resumo = elemento(id);
            if (resumo) {
                resumo.textContent =
                    dados[campo] || (campo === "descricao" || campo === "observacoes" ? "Nenhuma" : "");
            }
        });

        formularioDoacao.style.display = "none";
        exibir("resumoDoacao", "block");
        elemento("resumoDoacao")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

async function finalizarDoacao() {
    const botao = document.querySelector("#resumoDoacao button");

    try {
        if (botao) {
            botao.disabled = true;
            botao.textContent = "Registrando...";
        }

        const dados = new URLSearchParams(lerDadosDoacao());
        await fetch(URL_GOOGLE_SHEETS, { method: "POST", body: dados });

        const protocolo = `TE-${Math.floor(100000 + Math.random() * 900000)}`;
        const campoProtocolo = elemento("protocoloDoacao");
        if (campoProtocolo) campoProtocolo.textContent = protocolo;

        exibir("resumoDoacao", "none");
        exibir("confirmacaoDoacao", "block");
        elemento("confirmacaoDoacao")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (erro) {
        console.error("Erro ao enviar a doação:", erro);
        alert("Não foi possível registrar a doação. Verifique a conexão e tente novamente.");

        if (botao) {
            botao.disabled = false;
            botao.textContent = "Confirmar e registrar";
        }
    }
}

function voltarFormulario() {
    exibir("resumoDoacao", "none");
    exibir("donationForm", "block");
    elemento("donationForm")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function novaDoacao() {
    const formulario = elemento("donationForm");
    formulario?.reset();
    exibir("donationForm", "none");
    exibir("confirmacaoDoacao", "none");
    exibir("pixBox", "none");
    exibir("formPlaceholder", "block");
    atualizarCamposDoacao();
}

document.addEventListener("DOMContentLoaded", atualizarCamposDoacao);
