import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

const min = 6;
const max = 16;
const description =
  'password must have a uppercase, lowercase letter and a number';

const regExp = '^(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).+$';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(min)
  @MaxLength(max)
  @Matches(new RegExp(regExp, 'g'), {
    message: description,
  })
  password: string;
}
