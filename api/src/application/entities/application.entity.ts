import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from '@labour-hiring/enums';
import { User } from '@/user/entities/user.entity';
import { Job } from '@/job/entities/job.entity';

@Entity()
@Index(['jobId', 'applicantId'], { unique: true })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  jobId!: string;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: Job;

  @Column({ type: 'uuid' })
  applicantId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicantId' })
  applicant!: User;

  @Index()
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  // Bank details are sensitive (payout information + BVN) — excluded from
  // default selects, same as User.password. Fetch explicitly via
  // addSelect() only where actually needed (e.g. an employer initiating
  // payout), and never pass these through the logger.
  @Column({ type: 'varchar', select: false })
  bankName!: string;

  @Column({ type: 'varchar', select: false })
  bankAccountNumber!: string;

  @Column({ type: 'varchar', select: false })
  bvn!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
