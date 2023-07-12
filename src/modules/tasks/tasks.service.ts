import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(user: User, createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      date: createTaskDto.date,
      time: createTaskDto.time,
    });

    task.user = user;

    return await this.taskRepository.save(task);
  }

  async findAllTasksByUserId(options?: FindManyOptions<Task>): Promise<Task[]> {
    const tasks = await this.taskRepository.find(options);

    if (!tasks.length) {
      throw new NotFoundException(messagesHelper.TASK_NOT_FOUND);
    }

    return tasks;
  }

  async findOneTaskOrFail(options: FindOneOptions<Task>): Promise<Task> {
    try {
      return await this.taskRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.TASK_NOT_FOUND);
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: userId } },
    });

    this.taskRepository.merge(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async removeTask(userId: string, taskId: string): Promise<UpdateResult> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: userId } },
    });

    return await this.taskRepository.softDelete(task.id);
  }

  async restoreTask(userId: string, taskId: string): Promise<UpdateResult> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: userId } },
      withDeleted: true,
    });

    return await this.taskRepository.restore(task.id);
  }
}
