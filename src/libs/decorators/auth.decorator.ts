import { SetMetadata } from '@nestjs/common';

import { AuthType, ConditionGuardType } from 'src/libs/constants/auth.constant';

export type AuthMetadataPayload = {
  authTypes: AuthType[];
  options: { conditions: ConditionGuardType };
};

export const AUTH_TYPE_KEY = 'authTypes';
export const Auth = (
  authTypes: AuthType[],
  options?: { conditions: ConditionGuardType },
) =>
  SetMetadata(AUTH_TYPE_KEY, {
    authTypes,
    options: options ?? { conditions: ConditionGuardType.AND },
  });

export const IsPublic = () => Auth([AuthType.None]);
