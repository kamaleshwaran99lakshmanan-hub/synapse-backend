import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') // Generates a unique ID like "a1-b2-c3"
  id: string;

  @Column({ unique: true }) // No two users can have the same email
  email: string;

  @Column()
  name: string;

  @Column({ select: false }) // Security: Don't accidentally send passwords back to the frontend!
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}