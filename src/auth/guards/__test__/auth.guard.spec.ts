import { AuthGuard } from '../auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UserModel } from '../../../users/entities/user.entity';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let context: ExecutionContext;

  beforeEach(() => {
    authGuard = new AuthGuard();
    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: null }),
      }),
    } as unknown as ExecutionContext;
  });

  it('should return true if user is authenticated', () => {
    const user: UserModel = { id: 1, email: 'test@example.com' } as UserModel;

    jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({ user });

    expect(authGuard.canActivate(context)).toBe(true);
  });

  it('should return false if user is not authenticated', () => {
    jest
      .spyOn(context.switchToHttp(), 'getRequest')
      .mockReturnValue({ user: null });

    expect(authGuard.canActivate(context)).toBe(false);
  });

  it('should return false if user is undefined', () => {
    jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue({});

    expect(authGuard.canActivate(context)).toBe(false);
  });
});
