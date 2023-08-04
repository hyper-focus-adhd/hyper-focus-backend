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

import { BoardsService } from './boards.service';
import { BoardDto } from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@ApiTags('Board')
@ApiSecurity('Access Token')
@Controller('api/v1/boards')
@Serialize(BoardDto)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @ApiOperation({ summary: 'Create a new board' })
  @Post()
  async createBoard(
    @Body() body: CreateBoardDto,
    @CurrentUserId() user: User,
  ): Promise<Board> {
    return await this.boardsService.createBoard(user, body);
  }

  @ApiOperation({ summary: 'Find all boards by user id' })
  @Get()
  async findAllBoardsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<Board[]> {
    return await this.boardsService.findAllBoardsByUserId(userId);
  }

  @ApiOperation({ summary: 'Update a board' })
  @Patch(':boardId')
  async updateBoard(
    @Body() body: UpdateBoardDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Board> {
    return await this.boardsService.updateBoard(userId, boardId, body);
  }

  @ApiOperation({ summary: 'Delete a board' })
  @Delete(':boardId')
  async removeBoard(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Board> {
    return await this.boardsService.removeBoard(userId, boardId);
  }

  @ApiOperation({ summary: 'Restore a deleted board' })
  @Patch('restore/:boardId')
  async restoreBoard(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<UpdateResult> {
    return await this.boardsService.restoreBoard(userId, boardId);
  }
}
