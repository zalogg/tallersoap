const express = require('express');
const soap = require('soap');

const app = express();
const port = process.env.PORT || 3000;

// URL del servicio web SOAP
const url = 'http://www.dneonline.com/calculator.asmx?wsdl';

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Ruta para manejar la solicitud de suma
app.get('/add', (req, res) => {
    const num1 = req.query.num1;
    const num2 = req.query.num2;
    console.log(`Solicitud de suma para: ${num1} + ${num2}`);

    if (!num1 || !num2) {
        res.status(400).send('Faltan parámetros num1 o num2');
        return;
    }

    addNumbers(num1, num2, (err, result) => {
        if (err) {
            console.error('Error en la suma:', err);
            res.status(500).send('Error en la suma.');
        } else {
            res.send(`La suma de ${num1} + ${num2} = ${result}`);
        }
    });
});

// Función para sumar dos números
function addNumbers(num1, num2, callback) {
    soap.createClient(url, (err, client) => {
        if (err) {
            console.error('Error al crear el cliente SOAP:', err);
            callback(err);
            return;
        }
        console.log('Cliente SOAP creado con éxito.');

        const args = { intA: num1, intB: num2 };
        client.Add(args, (err, result) => {
            if (err) {
                console.error('Error al llamar al servicio SOAP:', err);
                callback(err);
                return;
            }
            console.log('Respuesta del servicio SOAP:', result);
            callback(null, result.AddResult);
        });
    });
}

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
