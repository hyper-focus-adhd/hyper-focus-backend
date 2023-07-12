import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
@Controller('api/v1/boards')
@Serialize(BoardDto)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(
    @Body() body: CreateBoardDto,
    @CurrentUserId() user: User,
  ): Promise<Board> {
    return await this.boardsService.createBoard(user, body);
  }

  @Get()
  async findAllBoardsByUserId(
    @CurrentUserId() userId: string,
  ): Promise<Board[]> {
    return await this.boardsService.findAllBoardsByUserId({
      where: { user: { id: userId } },
    });
  }

  @Patch(':boardId')
  async updateBoard(
    @Body() body: UpdateBoardDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Board> {
    return await this.boardsService.updateBoard(userId, boardId, body);
  }

  @Delete(':boardId')
  async removeBoard(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<UpdateResult> {
    return await this.boardsService.removeBoard(userId, boardId);
  }

  @Patch('restore/:boardId')
  async restoreBoard(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<UpdateResult> {
    return await this.boardsService.restoreBoard(userId, boardId);
  }
}
