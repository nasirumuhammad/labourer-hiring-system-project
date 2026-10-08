import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@labour-hiring/enums';
import { Payload } from '@labour-hiring/types';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.LABOURER)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: Payload) {
    return this.dashboardService.getSummary(user.sub);
  }
}
