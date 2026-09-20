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
import { JobStatus, PaymentType } from '@labour-hiring/enums';
import { User } from '@/user/entities/user.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  title!: string;

  // No separate employer-profile module exists yet, so the display name for
  // the posting employer lives directly on the job for now.
  @Column({ type: 'varchar' })
  companyName!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  location?: string;

  @Column({ type: 'uuid' })
  employerId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employerId' })
  employer!: User;

  @Index()
  @Column({ type: 'enum', enum: PaymentType })
  paymentType!: PaymentType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  minPay!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  maxPay!: string;

  @Column({ type: 'int', default: 0 })
  minExperienceYears!: number;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  skills!: string[];

  @Index()
  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.OPEN })
  status!: JobStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
