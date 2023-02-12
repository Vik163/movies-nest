import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserItem } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  //регистрация пользователя с хешем пароля без его возврата
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

  async getUser(query: object): Promise<UserItem> {
    return this.userModel.findOne(query);
  }
}
