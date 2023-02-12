import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserCurrent, UserItem } from 'src/users/interfaces/user.interface';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserCurrent> | null {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user && passwordValid) {
      return user;
    }
    return null;
  }

  async login(user: UserCurrent) {
    const payload = await this.validateUser(user.email, user.password);
    if (payload) {
      return {
        token: this.jwtService.sign({ _id: payload._id }),
      };
    }
  }
}
