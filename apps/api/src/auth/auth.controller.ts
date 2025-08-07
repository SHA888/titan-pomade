import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { GetUser } from './decorators/get-user.decorator';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PasswordResetService } from './password-reset.service';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { 
  SignInDto, 
  SignUpDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  ChangePasswordDto,
  AuthResponseDto 
} from './dto/auth-credentials.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Tokens successfully refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@GetUser() user: JwtPayload): Promise<AuthResponseDto> {
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.authService.refreshTokens(user.sub, user.email, user.role);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiResponse({
    status: 200,
    description: 'If the email exists, a password reset link has been sent',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    try {
      const resetToken = await this.passwordResetService.createPasswordResetToken(
        email,
      );

      if (resetToken) {
        await this.mailService.sendPasswordResetEmail(email, resetToken);
      }

      // Always return success to prevent email enumeration
      return {
        message:
          'If an account with that email exists, you will receive a password reset link',
      };
    } catch (error) {
      // Log the error but don't expose it to the client
      console.error('Error in forgot password:', error);
      return {
        message:
          'If an account with that email exists, you will receive a password reset link',
      };
    }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with a valid token' })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully reset',
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    await this.passwordResetService.resetPassword(token, newPassword);

    return { message: 'Password has been successfully reset' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Password change functionality coming soon',
  })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @GetUser() _user: JwtPayload,
    @Body() _changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    // TODO: Implement change password functionality in AuthService
    // const { currentPassword, newPassword } = _changePasswordDto;
    // await this.authService.changePassword(_user.sub, currentPassword, newPassword);
    return { message: 'Password change functionality coming soon' };
  }
}
