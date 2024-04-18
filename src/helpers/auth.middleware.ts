import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    console.log(
      '----------------------------------------------------------------',
    );
    // Get the token from the request headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    console.log(token);
    // Verify the token
    try {
      const decoded = this.jwtService.verify(token);
      req.userId = decoded?.userId;
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
