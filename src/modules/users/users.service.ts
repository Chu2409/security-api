/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UpdateUserReqDto } from './dto/req/update-user.dto'
import { CreateUserReqDto } from './dto/req/create-user.dto'
import { Db1Service } from 'src/core/db1/db1.service'
import { hashPassword } from 'src/shared/utils/encrypter'

@Injectable()
export class UsersService {
  constructor(private db1Service: Db1Service) {}

  async findAll() {
    const usuarios = await this.db1Service.usuario.findMany()
    return usuarios.map(({ password: _, ...usuario }) => usuario)
  }

  async create(dto: CreateUserReqDto) {
    await this.validateUniqueness({
      username: dto.username,
      correo: dto.correo,
    })

    const hashedPassword = hashPassword(dto.password)

    const usuario = await this.db1Service.usuario.create({
      data: {
        nombre: dto.nombre,
        username: dto.username,
        password: hashedPassword,
        correo: dto.correo,
      },
    })

    const { password: _, ...usuarioSinPassword } = usuario
    return usuarioSinPassword
  }

  async update(id: number, dto: UpdateUserReqDto) {
    await this.findOneOrThrow(id)

    if (dto.username || dto.correo) {
      await this.validateUniqueness({
        username: dto.username,
        correo: dto.correo,
        excludeUserId: id,
      })
    }

    const updateData: Record<string, unknown> = {}

    if (dto.nombre) updateData.nombre = dto.nombre
    if (dto.username) updateData.username = dto.username
    if (dto.correo) updateData.correo = dto.correo
    if (dto.password) updateData.password = hashPassword(dto.password)

    const usuario = await this.db1Service.usuario.update({
      where: { id },
      data: updateData,
    })

    const { password: _, ...usuarioSinPassword } = usuario
    return usuarioSinPassword
  }

  async findOneOrThrow(id: number) {
    const userFound = await this.db1Service.usuario.findUnique({
      where: { id },
    })

    if (!userFound) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }

    const { password: _, ...usuarioSinPassword } = userFound
    return usuarioSinPassword
  }

  async findByUsernameOrCorreoWithPassword(
    usernameOrCorreo: string,
  ): Promise<{ id: number; password: string; [key: string]: unknown } | null> {
    const userFound = await this.db1Service.usuario.findFirst({
      where: {
        OR: [{ username: usernameOrCorreo }, { correo: usernameOrCorreo }],
      },
    })

    return userFound
  }

  async remove(id: number) {
    await this.findOneOrThrow(id)

    const usuario = await this.db1Service.usuario.delete({
      where: { id },
    })

    const { password: _, ...usuarioSinPassword } = usuario
    return usuarioSinPassword
  }

  private async validateUniqueness({
    username,
    correo,
    excludeUserId,
  }: {
    username?: string
    correo?: string
    excludeUserId?: number
  }) {
    if (!username && !correo) return

    const whereClause: Record<string, unknown> = {}
    if (username) whereClause.username = username
    if (correo) whereClause.correo = correo
    if (excludeUserId) whereClause.id = { not: excludeUserId }

    const existingUser = await this.db1Service.usuario.findFirst({
      where: whereClause as never,
    })

    if (existingUser) {
      if (
        username &&
        (existingUser as { username?: string }).username === username
      ) {
        throw new ConflictException('El username ya está en uso')
      }
      if (correo && (existingUser as { correo?: string }).correo === correo) {
        throw new ConflictException('El correo ya está en uso')
      }
    }
  }
}
