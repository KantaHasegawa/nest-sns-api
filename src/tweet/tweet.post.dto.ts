import { IsNotEmpty } from 'class-validator';

export class TweetPostDto {
  @IsNotEmpty()
  content: string;

  // @IsBase64()
  image: string;
}
