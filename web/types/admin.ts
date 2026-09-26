import {
  ApplicationStatus,
  JobStatus,
  PaymentType,
  UserRole,
} from "@labour-hiring/enums";

export interface AdminUserProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  lga: string;
  address: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  deletedAt?: string | null;
  profile?: AdminUserProfile | null;
}

export interface AdminJob {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location?: string;
  employerId: string;
  paymentType: PaymentType;
  minPay: string;
  maxPay: string;
  status: JobStatus;
  createdAt: string;
  deletedAt?: string | null;
  employer?: AdminUser;
}

export interface AdminApplication {
  id: string;
  proposal: string;
  status: ApplicationStatus;
  createdAt: string;
  deletedAt?: string | null;
  applicant?: AdminUser;
  job?: AdminJob;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Dashboard {
  users: {
    total: number;
    labourers: number;
    employers: number;
    admins: number;
    active: number;
    deactivated: number;
  };
  jobs: { total: number; open: number; closed: number; draft: number };
  applications: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
  recentUsers: AdminUser[];
  recentJobs: AdminJob[];
  recentApplications: AdminApplication[];
}

export interface AdminUserDetail {
  user: AdminUser;
  jobs: AdminJob[];
  applications: AdminApplication[];
}

export interface AdminJobDetail {
  job: AdminJob;
  applicationCount: number;
  applications: AdminApplication[];
}

export interface AdminUsersQueryParams {
  role?: UserRole;
  status?: "active" | "deactivated";
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminJobsQueryParams {
  status?: JobStatus;
  paymentType?: PaymentType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminApplicationsQueryParams {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdminDto {
  email: string;
  password: string;
}

// Returned by POST /auth/signup/admin (AuthMapper.toPublicUserResponse) — deliberately thinner than AdminUser
export interface CreatedAdminUser {
  id: string;
  email: string;
  role: UserRole;
}
