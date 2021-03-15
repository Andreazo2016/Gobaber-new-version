import { Entity, ObjectID, Column, CreateDateColumn, UpdateDateColumn,ObjectIdColumn } from 'typeorm'

@Entity('notifications')
class Notification {

    @ObjectIdColumn()
    id: ObjectID;
    content: string;

    @Column('uuid')
    recipient_id: string;

    @Column({ default: false })
    read: boolean; I

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Notification