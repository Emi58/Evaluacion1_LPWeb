// Importa framework Express para crear aplicación web
import express from "express";
import crypto from "node:crypto";
import { randomUUID } from "node:crypto";

// Defir puerto del servidor. Usa el valor PORT en variables, o 3000 si no existe
const PORT = process.env.PORT ?? 3000;

// Crear nueva instancia de la aplicación Express
const app = express();

// Arreglo de usuarios con un usuario administrador inicial
// Contraseña almacenada en formato "salt:key" usando scrypt
const users = [
  {
    username: "admin",
    name: "Gustavo Alfredo Marín Sáez",
    password:
      "1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01",
  },
];

// Arreglo para almacenar los recordatorios en memoria
const reminders = [];

// Middleware para archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

// Middleware para procesar petición en formato JSON
app.use(express.json());

// Middleware de autenticación para proteger las rutas
const authMiddleware = (req, res, next) => {
  // Obtener token del encabezado X-Authorization
  const token = req.headers["x-authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Buscar usuario con el token proporcionado
  const user = users.find(u => u.token === token);
  if (!user) {
    return res.status(401).json({ error: "Token inválido" });
  }

  // Adjuntar usuario a la petición y continúa
  req.user = user;
  next();
};

// Ruta de inicio de sesión - POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  // Extraer credenciales de la petición
  const { username, password } = req.body;

  // Validar formato de entrada
  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Formato de usuario o contraseña inválido" });
  }

  // Buscar usuario en la base de datos
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Dividir contraseña almacenada en salt y key
  const [salt, storedKey] = user.password.split(":");
  // Generar key de la contraseña proporcionada usando mismo salt
  const key = crypto.scryptSync(password, salt, 64).toString("hex");

  // Verificar contraseña
  if (key !== storedKey) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Generar nuevo token de autenticación
  const token = crypto.randomBytes(48).toString("hex");
  user.token = token;

  // Devuelve info del usuario y el token
  res.json({
    username: user.username,
    name: user.name,
    token
  });
});

// Obtener todos los recordatorios - GET /api/reminders
app.get("/api/reminders", authMiddleware, (req, res) => {
  // Ordenar recordatorios: importantes primero, luego por fecha
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.important !== b.important) {
      return b.important ? 1 : -1;
    }
    return a.createdAt - b.createdAt;
  });
  res.json(sortedReminders);
});

// Crear nuevo recordatorio - POST /api/reminders
app.post("/api/reminders", authMiddleware, (req, res) => {
  // Extraer datos de la petición
  const { content, important = false } = req.body;

  // Validar contenido
  if (!content || typeof content !== "string" || content.trim().length === 0 || content.length > 120) {
    return res.status(400).json({ error: "Contenido inválido" });
  }

  // Validar campo important
  if (typeof important !== "boolean") {
    return res.status(400).json({ error: "Valor important inválido" });
  }

  // Crear nuevo objeto recordatorio
  const reminder = {
    id: randomUUID(),
    content,
    important,
    createdAt: Date.now()
  };

  // Guardar recordatorio y lo devuelve
  reminders.push(reminder);
  res.status(201).json(reminder);
});

// Actualizar recordatorio - PATCH /api/reminders/:id
app.patch("/api/reminders/:id", authMiddleware, (req, res) => {
  // Obtener ID del recordatorio de los parámetros de la URL
  const { id } = req.params;
  const { content, important } = req.body;

  // Buscar recordatorio en la base de datos
  const reminder = reminders.find(r => r.id === id);
  if (!reminder) {
    return res.status(404).json({ error: "Recordatorio no encontrado" });
  }

  // Actualizar contenido si se proporcionó
  if (content !== undefined) {
    if (typeof content !== "string" || content.trim().length === 0 || content.length > 120) {
      return res.status(400).json({ error: "Contenido inválido" });
    }
    reminder.content = content;
  }

  // Actualizar campo important si se proporcionó
  if (important !== undefined) {
    if (typeof important !== "boolean") {
      return res.status(400).json({ error: "Valor important inválido" });
    }
    reminder.important = important;
  }

  // Devuelve el recordatorio actualizado
  res.json(reminder);
});

// Eliminar recordatorio - DELETE /api/reminders/:id
app.delete("/api/reminders/:id", authMiddleware, (req, res) => {
  // Obtener ID del recordatorio de los parámetros de la URL
  const { id } = req.params;
  
  // Buscar índice del recordatorio
  const index = reminders.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Recordatorio no encontrado" });
  }

  // Eliminar el recordatorio del arreglo
  reminders.splice(index, 1);
  // Devolver éxito sin contenido
  res.status(204).send();
});

// Iniciar servidor y escuchar peticiones
app.listen(PORT, (error) => {
  if (error) {
    console.error(`No se puede ocupar el puerto ${PORT} :(`);
    return;
  }
  console.log(`Escuchando en el puerto ${PORT}`);
});
