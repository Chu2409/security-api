import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { SignInReqDto } from './dto/req/sign-in.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types/jwt-payload.interface'
import { comparePassword } from 'src/shared/utils/encrypter'
import { UsersService } from '../users/users.service'
import { Db1Service } from 'src/core/db1/db1.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly db1Service: Db1Service,
    private readonly jwtService: JwtService,
  ) {}

  async login({ usernameOrCorreo, password }: SignInReqDto) {
    const userFound =
      await this.usersService.findByUsernameOrCorreoWithPassword(
        usernameOrCorreo,
      )

    if (!userFound) throw new UnauthorizedException('Credenciales incorrectas')

    this.verifyPassword(password, userFound.password)

    // Obtener el usuario completo sin password
    const usuario = await this.db1Service.usuario.findUnique({
      where: { id: userFound.id },
    })

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = usuario

    return {
      token: this.createToken({
        id: usuario.id,
        // role: usuario.role, // Descomentar cuando se implementen roles
      }),
      user: userWithoutPassword,
    }
  }

  private verifyPassword(password: string, userPassword: string) {
    const isPasswordValid = comparePassword(password, userPassword)

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales incorrectas')

    return isPasswordValid
  }

  private readonly createToken = (payload: JwtPayload) => {
    return this.jwtService.sign(payload)
  }

  verifyToken = (token: string) => {
    try {
      return this.jwtService.verify(token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Token inválido')
    }
  }
}
