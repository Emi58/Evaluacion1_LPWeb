// Importamos el cliente de Prisma
import { PrismaClient } from '@prisma/client'

// Creamos una instancia del cliente
const prisma = new PrismaClient()

// Función de prueba asíncrona
async function main() {
  try {
    // Probamos crear un recordatorio
    const newReminder = await prisma.reminder.create({
      data: {
        content: "Recordatorio de prueba",
        important: true
      }
    })
    console.log('Recordatorio creado:', newReminder)

    // Probamos obtener todos los recordatorios
    const allReminders = await prisma.reminder.findMany()
    console.log('Todos los recordatorios:', allReminders)

    // Probamos obtener el usuario admin
    const adminUser = await prisma.user.findFirst({
      where: {
        username: 'admin'
      }
    })
    console.log('Usuario admin:', adminUser)

  } catch (error) {
    console.error('Error durante la prueba:', error)
  } finally {
    // Cerramos la conexión
    await prisma.$disconnect()
  }
}

// Ejecutamos las pruebas
main()