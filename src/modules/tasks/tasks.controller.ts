import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@ApiTags('Task')
@ApiSecurity('Access Token')
@Controller('api/v1/tasks')
@Serialize(TaskDto)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  async createTask(
    @Body() body: CreateTaskDto,
    @CurrentUserId() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(user, body);
  }

  @ApiOperation({ summary: 'Find all tasks by user id' })
  @Get()
  async findAllTasksByUserId(@CurrentUserId() userId: string): Promise<Task[]> {
    return await this.tasksService.findAllTasksByUserId(userId);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Patch(':taskId')
  async updateTask(
    @Body() body: UpdateTaskDto,
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    return await this.tasksService.updateTask(userId, taskId, body);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':taskId')
  async removeTask(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.removeTask(userId, taskId);
  }

  @ApiOperation({ summary: 'Restore a deleted task' })
  @Patch('restore/:taskId')
  async restoreTask(
    @CurrentUserId() userId: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.restoreTask(userId, taskId);
  }
}
