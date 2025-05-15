// Importar cliente de Prisma para interactuar con la base de datos
import { PrismaClient } from '@prisma/client'

// se crea una nueva instancia del cliente Prisma
const prisma = new PrismaClient()

// Exportar objeto repositorio que contiene todas las operaciones relacionadas con usuarios
export const userRepository = {
  // Busca un usuario por su token de autenticación
  async findByToken(token) {
    return prisma.user.findFirst({
      where: { token }
    })
  },

  // Función para el proceso de login que busca usuario por su nombre de usuario
  // La validación de la contraseña se realiza en otra capa
  async login(username, password) {
    return prisma.user.findFirst({
      where: { username }
    })
  },

  // Actualiza el token de autenticación de usuario específico
  // Se usa después de un login exitoso
  async updateToken(username, token) {
    return prisma.user.update({
      where: { username },
      data: { token }
    })
  },

  // Realiza el logout del usuario eliminando su token de autenticación
  // Establece el token como null en la base de datos
  async logout(token) {
    return prisma.user.update({
      where: { token },
      data: { token: null }
    })
  }
}