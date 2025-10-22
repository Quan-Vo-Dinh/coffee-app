import { createZodDto } from 'nestjs-zod';

import { MessageResSchema } from 'src/libs/models/response.model';

export class MessageResDto extends createZodDto(MessageResSchema) {}
