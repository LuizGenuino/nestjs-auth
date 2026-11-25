import { Injectable, Scope } from '@nestjs/common';
import { Post, Role, User } from '../../generated/prisma/client.js';
import { Ability, AbilityBuilder } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionResource =
    | Subjects<{
        User: User;
        Post: Post;
    }>
    | 'all';

// Na v7, usa-se Ability no lugar de PureAbility
export type AppAbility = Ability<
    [PermActions, PermissionResource],
    PrismaQuery
>;

export type DefinePermissions = (
    user: User,
    builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Role, DefinePermissions> = {
    ADMIN(user, { can }) {
        can('manage', 'all');
    },
    EDITOR(user, { can }) {
        can('create', 'Post');
        can('read', 'Post');
        can('update', 'Post');
    },
    WRITER(user, { can }) {
        can('create', 'Post');
        can('read', 'Post', { authorId: user.id });
        can('update', 'Post', { authorId: user.id });
    },
    READER(user, { can }) {
        can('read', 'Post', { published: true });
    },
};


// modelo de autorização
// rbac - role based access control
// abac - attribute based access control
// acl - action control list (s3)


@Injectable({ scope: Scope.REQUEST }) // Esse serviço vai ser gerado uma instancia por requisição
export class CaslAbilityService {

    ability: AppAbility

    createForUser(user: User) {

        const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

        rolePermissionsMap[user.role](user, builder)

        this.ability = builder.build()

        return this.ability
    }
}
