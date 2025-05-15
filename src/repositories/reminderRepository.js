// Importa cliente de Prisma para interactuar con la base de datos
import { PrismaClient } from '@prisma/client'

// Creamos una nueva instancia del cliente Prisma
const prisma = new PrismaClient()

// Exporta objeto repositorio que contiene todas las operaciones relacionadas con recordatorios
export const reminderRepository = {
  // Obtiene todos los recordatorios ordenados por importancia (descendente) y fecha de creación (ascendente)
  async findAll() {
    return prisma.reminder.findMany({
      orderBy: [
        { important: 'desc' },  // Primero muestra los importantes
        { createdAt: 'asc' }    // Luego ordena por fecha de creación
      ]
    })
  },

  // Busca un recordatorio específico por su ID
  async findById(id) {
    return prisma.reminder.findUnique({
      where: { id }
    })
  },

  // Crea un nuevo recordatorio en la base de datos
  async create(data) {
    return prisma.reminder.create({
      data
    })
  },

  // Actualiza recordatorio existente identificado por su ID
  async update(id, data) {
    return prisma.reminder.update({
      where: { id },
      data
    })
  },

  // Elimina recordatorio específico por su ID
  async delete(id) {
    return prisma.reminder.delete({
      where: { id }
    })
  }
}