import { Injectable, ForbiddenException } from '@nestjs/common';
// 1. Import 'Subjects' from your CASL ability factory
import { CaslAbilityFactory, AppAbility, Subjects } from './casl-ability.factory';
import { Action } from './casl.types';

@Injectable()
export class CaslService {
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  /**
   * Private helper method to create the ability object.
   */
  private getAbility(user: any): AppAbility {
    return this.caslAbilityFactory.createForUser(user);
  }

  /**
   * Checks if user can perform an action on a specific resource.
   * Throws ForbiddenException if not allowed.
   */
  // 2. Add 'extends Subjects' constraint to generic type T
  enforce<T extends Subjects>(user: any, action: Action, resource: T): void {
    const ability = this.getAbility(user);

    if (!ability.can(action, resource)) {
      throw new ForbiddenException('You are not allowed to perform this action');
    }
  }

  /**
   * Returns true/false without throwing.
   */
  // 3. Add 'extends Subjects' constraint to generic type T
  can<T extends Subjects>(user: any, action: Action, resource: T): boolean {
    const ability = this.getAbility(user);

    return ability.can(action, resource);
  }
}