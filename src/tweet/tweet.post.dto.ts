import { IsBase64, IsNotEmpty } from 'class-validator';

export class TweetPostDto {
  @IsNotEmpty()
  content: string;

  @IsBase64()
  image: string;
}
