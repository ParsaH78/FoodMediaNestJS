import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { AuthExceptionFilter } from 'src/filters/authException.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(AuthExceptionFilter)
  @Post('register')
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  signin(@Body() dto: LoginDto) {
    return this.authService.signin(dto);
  }
}
