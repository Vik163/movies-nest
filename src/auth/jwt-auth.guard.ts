import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokensService } from './tokens.service';

// Защита авторизации ==============================
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers.authorization;
      const user = this.tokenService.validateAccessToken(token);

      if (!token || !user) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
