import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
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
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      date: createTaskDto.date,
      time: createTaskDto.time,
      user: user,
    });

    const foundTask = await this.taskRepository.save(task);

    return this.findOneTaskOrFail({
      where: { id: foundTask.id },
      relations: ['user'],
    });
  }

  async findAllTasksByUserId(user: string): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { id: user } },
      relations: ['user'],
    });

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
    user: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: user } },
      relations: ['user'],
    });

    this.taskRepository.merge(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async removeTask(user: string, taskId: string): Promise<UpdateResult> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: user } },
    });

    return await this.taskRepository.softDelete(task.id);
  }

  async restoreTask(user: string, taskId: string): Promise<UpdateResult> {
    const task = await this.findOneTaskOrFail({
      where: { id: taskId, user: { id: user } },
      withDeleted: true,
    });

    return await this.taskRepository.restore(task.id);
  }
}
