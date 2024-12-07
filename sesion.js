const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();
const port = 3000;

// Middleware para parsear datos del formulario
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuración de la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gameburst",
});

conexion.connect((err) => {
    if (err) throw err;
    console.log("Conexión a la base de datos exitosa.");
});

// Ruta para servir la página de inicio de sesión
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pag1.html"));
});

// Ruta para manejar el inicio de sesión
app.post("/login", (req, res) => {
    const { correo , contraseña } = req.body;

    const query = `SELECT * FROM cuentas WHERE correo = ? AND contraseña = ?`;
    
    conexion.query(query, [correo, contraseña], (error, results) => {
        if (error) {
            console.error("Error al iniciar sesión:", error);
            return res.send("<script>alert('Error interno, intente más tarde.'); window.location.href = '/login';</script>");
        }

        if (results.length > 0) {
            res.send(`<script>alert('¡Bienvenido, ${results[0].nombre}!'); window.location.href = '/';</script>`);
            console.log('usuario' + correo + 'inicio sesion correctamente')
        } else {
            res.send("<script>alert('Correo o contraseña incorrectos.'); window.location.href = '/login';</script>");
            console.log('error de cuenta')
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
