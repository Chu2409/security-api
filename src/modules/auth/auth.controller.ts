import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInReqDto } from './dto/req/sign-in.dto'
import { Auth } from './decorators/auth.decorator'
import { GetUser } from './decorators/get-user.decorator'
import { UserResDto } from '../users/dto/res/user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: SignInReqDto) {
    return this.service.login(dto)
  }

  @Get('me')
  @Auth() // Sin roles por ahora, preparado para el futuro
  getMe(@GetUser() user: UserResDto) {
    return user
  }
}
