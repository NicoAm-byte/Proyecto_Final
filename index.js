const express = require('express');
const session = require('express-session'); // Importar express-session
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Configurar conexión a MySQL
let conexion = mysql.createConnection({
    host: 'localhost',
    database: 'gameburst',
    user: 'root',
    password: ''
});

// Middleware para parsear los datos de los formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar express-session
app.use(
    session({
        secret: 'tu-secreto-unico', // Cambia esto por una clave secreta segura
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
    })
);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));


/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CRUD de perfil
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
// Ruta para editar el perfil
app.put('/perfil/:id', (req, res) => {
    const idCuenta = req.params.id; // Obtener el ID del usuario desde los parámetros
    const { usuario, nombre, apellido, fecha_nac, correo } = req.body;

    const query = `
        UPDATE cuentas 
        SET usuario = ?, nombre = ?, apellido = ?, fecha_nac = ?, correo = ?
        WHERE id_cuenta = ?
    `;

    conexion.query(query, [usuario, nombre, apellido, fecha_nac, correo, idCuenta], (error) => {
        if (error) {
            console.error('Error al actualizar el perfil:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el perfil' });
        }

        res.status(200).json({ success: true, message: 'Perfil actualizado correctamente' });
    });
});


// Ruta para procesar el formulario de eliminación
app.post('/eliminar', function (req, res) {
    const correo = req.body.correo;
    const contraseña = req.body.contraseña;

    // Validar que los campos no estén vacíos
    if (!correo || !contraseña) {
        return res.status(400).send('Por favor completa todos los campos.');
    }

    // Consulta para eliminar la cuenta
    const eliminarCuenta = 'DELETE FROM cuentas WHERE correo = ? AND contraseña = ?';
    conexion.query(eliminarCuenta, [correo, contraseña], function (error, resultado) {
        if (error) {
            console.error('Error al eliminar la cuenta:', error);
            return res.status(500).send('Hubo un error al eliminar la cuenta.');
        }

        // Validar si se eliminó alguna fila
        if (resultado.affectedRows === 0) {
            return res.status(404).send('No se encontró una cuenta con los datos proporcionados.');
        }

        // Redirigir a la página principal después de eliminar
        res.redirect('/pag1.html');
    });
});


// Ruta para obtener los datos del perfil del usuario autenticado// Ruta para obtener los datos del perfil del usuario autenticado
app.get('/perfil', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ success: false, message: "No hay una sesión activa" });
    }

    // Enviar los datos del usuario almacenados en la sesión
    res.json(req.session.user);
});

// Ruta para manejar el registro de usuario
app.post('/validar', function (req, res) {
    const { usuario, nombre, apellido, fecha_nac, correo, contraseña } = req.body;

    const registrar = 'INSERT INTO cuentas (usuario, nombre, apellido, fecha_nac, correo, contraseña) VALUES (?, ?, ?, ?, ?, ?)';

    conexion.query(registrar, [usuario, nombre, apellido, fecha_nac, correo, contraseña], function (error) {
        if (!error) {
            console.log('Usuario registrado correctamente');
            return res.status(200).json({ success: true });
        }
        // Si ocurre un error, no se envía ninguna respuesta al cliente.
    });
});




// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
    const { correo, contraseña } = req.body;

    const query = `SELECT * FROM cuentas WHERE correo = ? AND contraseña = ?`;

    conexion.query(query, [correo, contraseña], (error, results) => {
        if (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
            
        }

        if (results.length > 0) {
            // Usuario encontrado
            console.log("Inicio de sesión exitoso");

            // Guardar los datos del usuario en la sesión
            req.session.user = {
                id_cuenta: results[0].id_cuenta,
                usuario: results[0].usuario,
                nombre: results[0].nombre,
                apellido: results[0].apellido,
                correo: results[0].correo
            };

            return res.status(200).json({ success: true });
        } else {
            // Credenciales incorrectas
            return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});



// Ruta para la página de inicio (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para servir la página de registro (pag1.html)
app.get('/pag1', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pag1.html'));
});


// Ruta para manejar el inicio de sesión
app.get('/inicioC', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicioC.html'));
});



// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar la sesión:", err);
            return res.status(500).send("Error al cerrar la sesión");
        }
        res.redirect('/pag1.html'); // Redirigir al login después de cerrar sesión
    });
});


// Ruta para recuperar la contraseña
app.post('/recuperar', (req, res) => {
    const { correo, nuevaContraseña } = req.body;

    // Validar que los campos no estén vacíos
    if (!correo || !nuevaContraseña) {
        return res.status(400).json({ success: false, message: 'Por favor completa todos los campos.' });
    }

    // Consulta para verificar si el correo existe en la base de datos
    const verificarCorreo = 'SELECT * FROM cuentas WHERE correo = ?';
    conexion.query(verificarCorreo, [correo], (error, results) => {
        if (error) {
            console.error('Error al verificar el correo:', error);
            return res.status(500).json({ success: false, message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            // Si no se encuentra el correo en la base de datos
            return res.status(404).json({ success: false, message: 'No se encuentra una cuenta con ese correo.' });
        }

        // Actualizar la contraseña en la base de datos
        const actualizarContraseña = 'UPDATE cuentas SET contraseña = ? WHERE correo = ?';
        conexion.query(actualizarContraseña, [nuevaContraseña, correo], (error) => {
            if (error) {
                console.error('Error al actualizar la contraseña:', error);
                return res.status(500).json({ success: false, message: 'Error al actualizar la contraseña' });
            }

            // Si todo sale bien, enviar una respuesta exitosa
            return res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
        });
    });
});



// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


