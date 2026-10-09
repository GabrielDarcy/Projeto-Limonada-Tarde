const URL_GOOGLE_SHEETS =
    "https://script.google.com/macros/s/AKfycbx-31vh3_OJSmO7tWVl0U_LA27rAWR_--sgP8WEoZMuD8haNgCz--U-VevLPXySbCj1/exec";


/* =========================================================
   ABRIR / FECHAR CATEGORIAS
   ========================================================= */

function abrirDoacao(id) {

    const todas =
        document.querySelectorAll(".donation-content");

    todas.forEach(function (conteudo) {

        if (conteudo.id !== id) {
            conteudo.style.display = "none";
        }

    });

    const conteudo =
        document.getElementById(id);

    if (!conteudo) {
        return;
    }

    const aberto =
        conteudo.style.display === "block";

    conteudo.style.display =
        aberto ? "none" : "block";
}


/* =========================================================
   SELECIONAR TIPO DE DOAÇÃO
   ========================================================= */

function selecionarDoacao(tipo) {

    const campoTipo =
        document.getElementById("tipoDoacao");

    if (!campoTipo) {
        return;
    }

    campoTipo.value = tipo;

    atualizarCamposDoacao();

    const area =
        document.querySelector(".donation-form-area");

    if (area) {

        area.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
}


/* =========================================================
   ATUALIZAR FORMULÁRIO
   ========================================================= */

function atualizarCamposDoacao() {

    const tipo =
        document.getElementById("tipoDoacao");

    const formulario =
        document.getElementById("donationForm");

    const placeholder =
        document.getElementById("formPlaceholder");

    const pixBox =
        document.getElementById("pixBox");

    const descricao =
        document.getElementById("descricao");

    const observacoes =
        document.getElementById("observacoes");

    const localEntrega =
        document.getElementById("localEntrega");


    if (!tipo) {
        return;
    }


    const valorSelecionado =
        tipo.value;


    /* -----------------------------------------
       NENHUM TIPO SELECIONADO
       ----------------------------------------- */

    if (valorSelecionado === "") {

        if (formulario) {
            formulario.style.display = "none";
        }

        if (pixBox) {
            pixBox.style.display = "none";
        }

        if (placeholder) {
            placeholder.style.display = "block";
        }

        return;
    }


    /* -----------------------------------------
       DOAÇÃO FINANCEIRA
       ----------------------------------------- */

    if (valorSelecionado === "Doação financeira") {

        if (formulario) {
            formulario.style.display = "none";
        }

        if (placeholder) {
            placeholder.style.display = "none";
        }

        if (pixBox) {
            pixBox.style.display = "block";
        }

        if (descricao) {
            descricao.required = false;
        }

        if (observacoes) {
            observacoes.required = false;
        }

        if (localEntrega) {
            localEntrega.required = false;
        }

        return;
    }


    /* -----------------------------------------
       DEMAIS DOAÇÕES
       ----------------------------------------- */

    if (formulario) {
        formulario.style.display = "block";
    }

    if (placeholder) {
        placeholder.style.display = "none";
    }

    if (pixBox) {
        pixBox.style.display = "none";
    }

    if (descricao) {
        descricao.required = true;
    }

    if (observacoes) {
        observacoes.required = false;
    }

    if (localEntrega) {
        localEntrega.required = true;
    }

}


/* =========================================================
   COPIAR CHAVE PIX
   ========================================================= */

function copiarPix() {

    const pixKey =
        document.getElementById("pixKey");

    if (!pixKey) {
        return;
    }

    const chave =
        pixKey.textContent.trim();


    if (chave === "SUA-CHAVE-PIX-AQUI") {

        alert(
            "Configure a chave PIX da Thermal Express no HTML antes de utilizar este botão."
        );

        return;
    }


    navigator.clipboard
        .writeText(chave)

        .then(function () {

            alert("Chave PIX copiada!");

        })

        .catch(function () {

            alert(
                "Não foi possível copiar automaticamente. Copie a chave manualmente."
            );

        });

}


/* =========================================================
   FORMULÁRIO — PRIMEIRA ETAPA
   MOSTRA O RESUMO
   ========================================================= */

const formularioDoacao =
    document.getElementById("donationForm");


if (formularioDoacao) {

    formularioDoacao.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nome =
                document.getElementById("nome")?.value || "";

            const email =
                document.getElementById("email")?.value || "";

            const telefone =
                document.getElementById("telefone")?.value || "";

            const endereco =
                document.getElementById("endereco")?.value || "";

            const tipo =
                document.getElementById("tipoDoacao")?.value || "";

            const descricao =
                document.getElementById("descricao")?.value || "";

            const observacoes =
                document.getElementById("observacoes")?.value || "";

            const entrega =
                document.getElementById("localEntrega")?.value || "";


            /* -----------------------------------------
               PREENCHER RESUMO
               ----------------------------------------- */

            const resumoNome =
                document.getElementById("resumoNome");

            const resumoEmail =
                document.getElementById("resumoEmail");

            const resumoTelefone =
                document.getElementById("resumoTelefone");

            const resumoEndereco =
                document.getElementById("resumoEndereco");

            const resumoTipo =
                document.getElementById("resumoTipo");

            const resumoDescricao =
                document.getElementById("resumoDescricao");

            const resumoEntrega =
                document.getElementById("resumoEntrega");

            const resumoObservacoes =
                document.getElementById("resumoObservacoes");


            if (resumoNome) {
                resumoNome.textContent = nome;
            }

            if (resumoEmail) {
                resumoEmail.textContent = email;
            }

            if (resumoTelefone) {
                resumoTelefone.textContent = telefone;
            }

            if (resumoEndereco) {
                resumoEndereco.textContent = endereco;
            }

            if (resumoTipo) {
                resumoTipo.textContent = tipo;
            }

            if (resumoDescricao) {

                resumoDescricao.textContent =
                    descricao || "Nenhuma";

            }

            if (resumoEntrega) {
                resumoEntrega.textContent = entrega;
            }

            if (resumoObservacoes) {

                resumoObservacoes.textContent =
                    observacoes || "Nenhuma";

            }


            formularioDoacao.style.display = "none";


            const resumo =
                document.getElementById("resumoDoacao");


            if (resumo) {

                resumo.style.display = "block";

                resumo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


/* =========================================================
   FINALIZAR DOAÇÃO
   ENVIA OS DADOS PARA O GOOGLE SHEETS
   ========================================================= */

async function finalizarDoacao() {

    const botao =
        document.querySelector(
            "#resumoDoacao button"
        );


    try {

        if (botao) {

            botao.disabled = true;
            botao.textContent = "Registrando...";

        }


        const nome =
            document.getElementById("nome")?.value || "";

        const email =
            document.getElementById("email")?.value || "";

        const telefone =
            document.getElementById("telefone")?.value || "";

        const endereco =
            document.getElementById("endereco")?.value || "";

        const tipoDoacao =
            document.getElementById("tipoDoacao")?.value || "";

        const descricao =
            document.getElementById("descricao")?.value || "";

        const observacoes =
            document.getElementById("observacoes")?.value || "";

        const localEntrega =
            document.getElementById("localEntrega")?.value || "";


        const dados =
            new URLSearchParams();


        dados.append(
            "nome",
            nome
        );

        dados.append(
            "email",
            email
        );

        dados.append(
            "telefone",
            telefone
        );

        dados.append(
            "endereco",
            endereco
        );

        dados.append(
            "tipoDoacao",
            tipoDoacao
        );

        dados.append(
            "descricao",
            descricao
        );

        dados.append(
            "observacoes",
            observacoes
        );

        dados.append(
            "localEntrega",
            localEntrega
        );


        await fetch(
            URL_GOOGLE_SHEETS,
            {
                method: "POST",
                body: dados
            }
        );


        const protocolo =
            "TE-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            );


        const campoProtocolo =
            document.getElementById(
                "protocoloDoacao"
            );


        if (campoProtocolo) {
            campoProtocolo.textContent =
                protocolo;
        }


        const resumo =
            document.getElementById(
                "resumoDoacao"
            );


        if (resumo) {
            resumo.style.display = "none";
        }


        const confirmacao =
            document.getElementById(
                "confirmacaoDoacao"
            );


        if (confirmacao) {

            confirmacao.style.display =
                "block";

            confirmacao.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }


    } catch (erro) {

        console.error(
            "Erro ao enviar a doação:",
            erro
        );


        alert(
            "Não foi possível registrar a doação. Verifique a conexão e tente novamente."
        );


        if (botao) {

            botao.disabled = false;

            botao.textContent =
                "Confirmar e registrar";

        }

    }

}


/* =========================================================
   VOLTAR PARA O FORMULÁRIO
   ========================================================= */

function voltarFormulario() {

    const resumo =
        document.getElementById(
            "resumoDoacao"
        );

    const formulario =
        document.getElementById(
            "donationForm"
        );


    if (resumo) {
        resumo.style.display = "none";
    }


    if (formulario) {

        formulario.style.display =
            "block";

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   FAZER OUTRA DOAÇÃO
   ========================================================= */

function novaDoacao() {

    const formulario =
        document.getElementById(
            "donationForm"
        );

    const confirmacao =
        document.getElementById(
            "confirmacaoDoacao"
        );

    const placeholder =
        document.getElementById(
            "formPlaceholder"
        );

    const pixBox =
        document.getElementById(
            "pixBox"
        );


    if (formulario) {

        formulario.reset();

        formulario.style.display =
            "none";

    }


    if (confirmacao) {
        confirmacao.style.display =
            "none";
    }


    if (pixBox) {
        pixBox.style.display =
            "none";
    }


    if (placeholder) {
        placeholder.style.display =
            "block";
    }


    atualizarCamposDoacao();

}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarCamposDoacao();

    }
);