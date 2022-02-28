import { IsString } from 'class-validator';

export class GreetingDto {
  @IsString()
  greeting!: string;

  @IsString()
  name!: string;
}
