import { NubiaEvent } from '@indigobit/nubia.common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user, cookies } = request;

    const { userId, exp, roles } = user;
    const { access_token } = cookies;

    const auth: NubiaEvent['auth'] = {
      userId,
      exp,
      access_token,
      roles: roles,
    };

    return data ? auth[data] : auth;
  },
);
