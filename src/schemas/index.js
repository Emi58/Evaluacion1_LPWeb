// Importar las funciones necesarias de la biblioteca valibot
import { object, string, boolean, optional } from 'valibot'

// Esquema para validar el inicio de sesión
// Requiere nombre de usuario y contraseña
export const loginSchema = object({
  username: string(),  // Campo obligatorio de tipo string para el nombre de usuario
  password: string()   // Campo obligatorio de tipo string para la contraseña
})

// Esquema para validar la creación de un nuevo recordatorio
// Requiere contenido y opcionalmente si es importante
export const createReminderSchema = object({
  content: string(),                  // Campo obligatorio de tipo string para el contenido
  important: optional(boolean())      // Campo opcional de tipo boolean para marcar importancia
})

// Esquema para validar la actualización parcial de un recordatorio
// Todos los campos son opcionales
export const updateReminderSchema = object({
  content: optional(string()),        // Campo opcional de tipo string para el contenido
  important: optional(boolean())      // Campo opcional de tipo boolean para marcar importancia
})