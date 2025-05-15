// Importar cliente de Prisma para interactuar con la base de datos
import { PrismaClient } from '@prisma/client'
// Importar módulo crypto de Node.js para manejo de encriptación
import crypto from 'node:crypto'

// Crea nueva instancia del cliente Prisma
const prisma = new PrismaClient()

// Función principal que se ejecuta para sembrar la base de datos
async function main() {
  // Generar un salt aleatorio de 16 bytes y convertirlo a hexadecimal
  const salt = crypto.randomBytes(16).toString('hex')
  // Crear clave usando scrypt con la contraseña 'certamen123' y el salt generado
  const key = crypto.scryptSync('certamen123', salt, 64).toString('hex')
  // Combinar el salt y la clave para crear la contraseña final
  const password = `${salt}:${key}`

  // Crear o actualizar el usuario administrador en la base de datos
  await prisma.user.upsert({
    where: { username: 'admin' },     // Buscar por nombre de usuario 'admin'
    update: {},                       // No actualiza nada si ya existe
    create: {                         // Crea nuevo usuario si no existe
      username: 'admin',
      name: 'Gustavo Alfredo Marín Sáez',
      password: password
    },
  })
}

// Ejecuta función principal
main()
  .then(async () => {
    // Desconecta el cliente Prisma después de completar la operación
    await prisma.disconnect()
  })
  .catch(async (e) => {
    // Maneja cualquier error que pueda ocurrir
    console.error(e)
    // Desconecta el cliente Prisma en caso de error
    await prisma.disconnect()
    // Termina el proceso con código de error
    process.exit(1)
  })