import { IsAlphanumeric, Length } from 'class-validator';

export class UserPostDto {
  @Length(1, 10)
  name: string;

  @IsAlphanumeric()
  @Length(5, 10)
  password: string;
}
