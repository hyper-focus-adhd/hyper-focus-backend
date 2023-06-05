import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = await this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      date: createTaskDto.date,
      time: createTaskDto.time,
    });

    task.user = user;

    return await this.taskRepository.save(task);
  }

  async findAllByUser(options?: FindManyOptions<Task>): Promise<Task[]> {
    return await this.taskRepository.find(options);
  }

  async findOneOrFail(options: FindOneOptions<Task>): Promise<Task> {
    try {
      return await this.taskRepository.findOneOrFail(options);
    } catch (error: any) {
      throw new NotFoundException(messagesHelper.TASK_NOT_FOUND);
    }
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOneOrFail({
      where: { id: taskId, user: { id: userId } },
    });

    this.taskRepository.merge(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async remove(taskId: string, userId: string): Promise<UpdateResult> {
    const task = await this.taskRepository.findOneOrFail({
      where: { id: taskId, user: { id: userId } },
    });

    return await this.taskRepository.softDelete(task.id);
  }

  async restore(taskId: string, userId: string): Promise<UpdateResult> {
    const task = await this.findOneOrFail({
      where: { id: taskId, user: { id: userId } },
      withDeleted: true,
    });

    return await this.taskRepository.restore(task.id);
  }
}
