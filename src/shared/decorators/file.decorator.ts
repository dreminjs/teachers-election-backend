import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const File = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string =>
        ctx.switchToHttp().getRequest().file.fieldname
)