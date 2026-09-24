const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm && contactSuccess) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const assunto = contactForm.elements.assunto.value.trim();
    const mensagem = contactForm.elements.message.value.trim();

    if (!nome || !email || !mensagem) {
      alert('Preencha todos os campos antes de enviar.');
      return;
    }

    const payload = new FormData(contactForm);
    payload.set('_captcha', 'false');
    payload.set('_template', 'table');
    payload.set('_subject', `Contato pelo site: ${assunto}`);
    payload.set('_replyto', email);
    payload.set(
      'message',
      `${mensagem}\n\n---\nNome: ${nome}\nE-mail: ${email}`
    );

    try {
      const response = await fetch('https://formsubmit.co/ajax/contatothermal@gmail.com', {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar o e-mail');
      }

      contactForm.reset();
      contactForm.hidden = true;
      contactSuccess.hidden = false;
    } catch (error) {
      alert('Não foi possível enviar a mensagem. Tente novamente mais tarde.');
    }
  });
}
