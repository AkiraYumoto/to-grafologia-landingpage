document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.contacto-form');
    
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitamos que la página se recargue

            // Recolectamos los datos
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const interes = document.getElementById('interes').value;
            const mensaje = document.getElementById('mensaje').value;
            const boton = document.querySelector('.btn-enviar');

            boton.textContent = 'Enviando...';
            boton.disabled = true;

            try {
                // Llamamos a la ruta de la Netlify Function que vamos a crear
                const response = await fetch('/.netlify/functions/enviar-email', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, email, interes, mensaje }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert('¡Mensaje enviado con éxito! Tatiana se pondrá en contacto pronto.');
                    formulario.reset();
                } else {
                    throw new Error('Falló el envío en el servidor');
                }
            } catch (error) {
                console.error(error);
                alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo más tarde.');
            } finally {
                boton.textContent = 'ENVIAR SOLICITUD';
                boton.disabled = false;
            }
        });
    }
});