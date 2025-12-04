import { applyDecorators, UseGuards } from '@nestjs/common'
import { RoleProtected } from './role-protected.decorator'
import { AuthGuard } from '@nestjs/passport'
// import { USER_ROLE } from 'src/modules/users/types/user-role.enum' // Descomentar cuando se implementen roles
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

// Preparado para roles futuros: cambiar any[] por USER_ROLE[] cuando se implementen
export function Auth(...roles: any[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), JwtAuthGuard),
  )
}
