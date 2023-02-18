import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdUserRequest, UserItem } from './interfaces/user.interface';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(req: IdUserRequest): Promise<UserItem> {
    const id = req.user._id;

    const currentUser = await this.userModel.findById(id);
    return currentUser;
  }

  async updateUser(updateUserDto: UpdateUserDto, req: IdUserRequest) {
    const id = req.user._id;
    const updateUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
        runValidators: true,
      },
    );
    return updateUser;
  }
}
