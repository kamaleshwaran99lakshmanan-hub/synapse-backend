import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = await this.usersService.create({ name, email, password: hashedPassword });
    const { password, ...result } = user;
    return result;
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    const name = user?.name || 'User';
    console.log('User found:', user);

console.log("Attempting to verify password:", pass);

const isPasswordValid = user ? await bcrypt.compare(pass, user.password) : false;

console.log(`Was the password match successful? ${isPasswordValid ? '✅ Yes' : '❌ No'}`);

if (user) {
    console.log("Stored Hash in DB:", user.password);
}
    console.log('Password valid:', isPasswordValid);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { email: user.email, sub: user.id };
      return {name, access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}