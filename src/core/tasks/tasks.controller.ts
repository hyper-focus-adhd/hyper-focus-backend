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
import { Serialize } from '../../common/interceptors/serialize.interceptor';
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
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUserId() user: User,
  ): Promise<Task> {
    return await this.tasksService.createTask(user, createTaskDto);
  }

  @ApiOperation({ summary: 'Find all tasks by user id' })
  @Get()
  async findAllTasksByUserId(@CurrentUserId() user: string): Promise<Task[]> {
    return await this.tasksService.findAllTasksByUserId(user);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Patch(':taskId')
  async updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUserId() user: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    return await this.tasksService.updateTask(user, taskId, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':taskId')
  async removeTask(
    @CurrentUserId() user: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.removeTask(user, taskId);
  }

  @ApiOperation({ summary: 'Restore a deleted task' })
  @Patch('restore/:taskId')
  async restoreTask(
    @CurrentUserId() user: string,
    @Param('taskId') taskId: string,
  ): Promise<UpdateResult> {
    return await this.tasksService.restoreTask(user, taskId);
  }
}
