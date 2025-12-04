import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class SignInReqDto {
  @IsString({ message: 'usernameOrCorreo must be a string' })
  @IsNotEmpty({ message: 'usernameOrCorreo must not be empty' })
  usernameOrCorreo: string

  @IsString({ message: 'password must be a string' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  @IsNotEmpty({ message: 'password must not be empty' })
  password: string
}
