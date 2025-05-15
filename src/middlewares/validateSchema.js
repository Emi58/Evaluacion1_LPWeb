// Importa la función parse de la biblioteca valibot para validar esquemas
import { parse } from 'valibot'

// Función factory que crea un middleware de validación basado en un esquema
export function validateSchema(schema) {
  // Retorna el middleware que será utilizado por Express
  return (req, res, next) => {
    try {
      // Intenta validar el cuerpo de la solicitud contra el esquema proporcionado
      const validated = parse(schema, req.body)
      // Si la validación es exitosa, actualiza el cuerpo de la solicitud con los datos validados
      req.body = validated
      // Continúa con el siguiente middleware en la cadena
      next()
    } catch (error) {
      // Si la validación falla, responde con un código de estado 400 (Bad Request)
      res.status(400).json({ error: 'Datos inválidos' })
    }
  }
}