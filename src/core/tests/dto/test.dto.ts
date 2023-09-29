import { Expose, Transform, Type } from 'class-transformer';

import { currentTimeZone } from '../../../common/helpers/timezone.helper';
import { UserDto } from '../../users/dtos/user.dto';
import { QuestionEntity, Score } from '../helper/test-helper';

export class TestDto {
  @Expose()
  id: string;

  @Expose()
  test_a: QuestionEntity[];

  @Expose()
  test_b: QuestionEntity[];

  @Expose()
  result: boolean;

  @Expose()
  score: Score;

  @Transform(({ value }) => currentTimeZone(value))
  @Expose()
  created_at: Date;

  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
