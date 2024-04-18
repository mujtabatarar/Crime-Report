import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  TCPPort: process.env.TCP_PORT,
  TCPHost: process.env.TCP_HOST,

  logMode: process.env.LOG_MODE,
  jwtSecret: process.env.JWT_SECRET,
}));
