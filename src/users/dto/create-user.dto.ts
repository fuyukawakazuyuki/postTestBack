import { CreateProfileDto } from "src/profiles/dto/create-profile.dto";
enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }
export class CreateUserDto {
    email: string;
    name?: string;
    password: string;
    role?: Role;
    profile?: CreateProfileDto;
}
