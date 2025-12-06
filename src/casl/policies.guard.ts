import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from './check-abilities.decorator';
import { CaslAbilityFactory } from './casl-ability.factory';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ??
      [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const ability = this.abilityFactory.defineAbility(user);

    return rules.every(rule => ability.can(rule.action, rule.subject));
  }
}
