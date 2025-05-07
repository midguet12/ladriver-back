import { IsString, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Username must be an email' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  sessionKey: string;
}