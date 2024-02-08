import { IsNotEmpty } from 'class-validator';

export class TweetPostDto {
  @IsNotEmpty()
  content: string;
}
