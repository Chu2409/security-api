import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator'
// import { META_ROLES } from '../decorators/role-protected.decorator' // Descomentar cuando se implementen roles
import { Observable } from 'rxjs'
import { UserResDto } from 'src/modules/users/dto/res/user.dto'
// import { USER_ROLE } from 'src/modules/users/types/user-role.enum' // Descomentar cuando se implementen roles

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  // 1. Verifica si la ruta es pública (-> strategy)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }

  // 4. Verifica si el usuario tiene los permisos necesarios (-> strategy)
  handleRequest<TUser = UserResDto>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    err: any,
    user: TUser | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    _info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
  ) {
    // Primero verificamos la autenticación
    if (err || !user) {
      throw new UnauthorizedException('Inicie sesión para continuar')
    }

    // Preparado para verificación de roles cuando se implementen
    // const requiredRoles = this.reflector.getAllAndOverride<USER_ROLE[]>(
    //   META_ROLES,
    //   [context.getHandler(), context.getClass()],
    // )
    //
    // if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    //   const userRole = (user as unknown as UserResDto).role
    //   const hasRole = requiredRoles.includes(userRole)
    //
    //   if (!hasRole) {
    //     throw new BusinessException(
    //       'No tienes permisos para acceder a este recurso',
    //       HttpStatus.FORBIDDEN,
    //     )
    //   }
    // }

    return user
  }
}
