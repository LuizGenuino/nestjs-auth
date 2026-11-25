import { SetMetadata } from "@nestjs/common";
import { Role } from "../generated/prisma/enums.js";

export const RequiredRoles = (...roles: Role[]) => SetMetadata('roles', roles)