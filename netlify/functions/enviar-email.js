export async function handler(event) {
    // Solo permitimos peticiones POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Método no permitido' };
    }

    try {
        const { nombre, email, interes, mensaje } = JSON.parse(event.body);

        const correoRemitente = 'tatianaolivera.pg@gmail.com'; 
        
        const correoDestino = 'tatianaolivera.pg@gmail.com';


        const payload = {
            personalizations: [{
                to: [{ email: correoDestino }] 
            }],
            from: { email: correoRemitente, name: "Web To.Grafología" }, 
            subject: `Nueva consulta de: ${nombre} - ${interes}`,
            reply_to: { email: email, name: nombre }, 
            content: [{
                type: "text/html",
                value: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2 style="color: #9370DB;">Nueva solicitud de análisis grafológico</h2>
                        <p><strong>Cliente:</strong> ${nombre}</p>
                        <p><strong>Email de contacto:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Área de interés:</strong> ${interes}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p><strong>Mensaje del cliente:</strong></p>
                        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
                            ${mensaje || '<i>El cliente no dejó un mensaje adicional.</i>'}
                        </p>
                    </div>
                `
            }]
        };

        
        const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (sendgridResponse.ok || sendgridResponse.status === 202) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Correo enviado con éxito" })
            };
        } else {
            const errorData = await sendgridResponse.text();
            console.error("Error de SendGrid:", errorData);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Error al enviar mediante SendGrid" })
            };
        }

    } catch (error) {
        console.error("Error en la función:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor" })
        };
    }
}