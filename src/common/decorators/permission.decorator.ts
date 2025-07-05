import { CustomDecorator, SetMetadata } from "@nestjs/common";
export const PERMISSION_KEY = "permission";
export const Permission = (menu: string, action: string): CustomDecorator<string> =>
  SetMetadata(PERMISSION_KEY, { menu, action });
