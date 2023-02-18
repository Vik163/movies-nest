import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { UserCurrent, UserItem } from 'src/users/interfaces/user.interface';
import { User, UserDocument } from 'src/users/schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  public async createUser(createUserDto: CreateUserDto): Promise<UserItem> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    try {
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      }).save();
      (await newUser).password = undefined;
      return newUser;
    } catch (err) {}
  }

  public async login(user: UserCurrent): Promise<{ token: string }> {
    const payload = await this.validateUser(user.email, user.password);
    if (payload) {
      return {
        token: `Bearer ${this.jwtService.sign({ _id: payload._id })}`,
      };
    }
  }
}
