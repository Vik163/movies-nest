import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserItem } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  //Получить пользователя --------------------------------------
  async getUser(userId: string): Promise<IUserItem> {
    const currentUser = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return currentUser;
  }

  //Обновить пользователя ---------------------------------------
  async updateUser(updateUserDto: UpdateUserDto, userId: string) {
    try {
      const updateUser = await this.userModel.findByIdAndUpdate(
        userId,
        updateUserDto,
        {
          new: true,
          runValidators: true,
        },
      );
      return updateUser;
    } catch (e) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  }
}
