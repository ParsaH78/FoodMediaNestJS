import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  signin(@Body() dto: LoginDto) {
    return this.authService.signin(dto);
  }
}
