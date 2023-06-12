import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
@Serialize(TaskDto)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(
    @Body() body: CreateTaskDto,
    @CurrentUserId() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(body, user);
  }

  @Get()
  async findAllTasksByUserId(@CurrentUserId() userId: string): Promise<Task[]> {
    return await this.tasksService.findAllTasksByUserId({
      where: { user: { id: userId } },
    });
  }

  @Patch(':taskId')
  async updateTask(
    @Body() body: UpdateTaskDto,
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    return await this.tasksService.updateTask(taskId, body, userId);
  }

  @Delete(':taskId')
  async removeTask(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.removeTask(taskId, userId);
  }

  @Patch('restore/:taskId')
  async restoreTask(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.restoreTask(taskId, userId);
  }
}
