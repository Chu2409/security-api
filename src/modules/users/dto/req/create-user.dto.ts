import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserReqDto {
  @IsString({ message: 'nombre must be a string' })
  @IsNotEmpty({ message: 'nombre is required' })
  nombre: string

  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username is required' })
  username: string

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string

  @IsEmail({}, { message: 'correo must be a valid email address' })
  @IsNotEmpty({ message: 'correo is required' })
  correo: string
}
