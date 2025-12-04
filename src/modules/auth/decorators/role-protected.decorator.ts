import { SetMetadata } from '@nestjs/common'
// import { USER_ROLE } from 'src/modules/users/types/user-role.enum' // Descomentar cuando se implementen roles

export const META_ROLES = 'roles'

// Preparado para roles futuros: cambiar any por USER_ROLE cuando se implementen
export const RoleProtected = (...args: any[]) => {
  return SetMetadata(META_ROLES, args)
}
