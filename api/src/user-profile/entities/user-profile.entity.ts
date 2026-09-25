import { User } from '@/user/entities/user.entity';
import { IdentityType } from '@labour-hiring/types';
import {
  OneToOne,
  Entity,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  state!: string;

  @Column()
  lga!: string;

  @Column()
  address!: string;

  @Column({ type: 'enum', enum: IdentityType })
  identityType!: IdentityType;

  @Column({ type: 'varchar', length: 12 })
  identityNumber!: string;

  @Column({ select: false })
  bankName!: string;

  @Column({ select: false })
  bankAccountNumber!: string;
}
