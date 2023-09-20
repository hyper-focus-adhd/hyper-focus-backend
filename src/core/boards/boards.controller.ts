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
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUserId() user: User,
  ): Promise<Board> {
    return await this.boardsService.createBoard(user, createBoardDto);
  }

  @ApiOperation({ summary: 'Find all boards by user id' })
  @Get()
  async findAllBoardsByUserId(@CurrentUserId() user: string): Promise<Board[]> {
    return await this.boardsService.findAllBoardsByUserId(user);
  }

  @ApiOperation({ summary: 'Update a board' })
  @Patch(':boardId')
  async updateBoard(
    @Body() updateBoardDto: UpdateBoardDto,
    @CurrentUserId() user: string,
    @Param('boardId') boardId: string,
  ): Promise<Board> {
    return await this.boardsService.updateBoard(user, boardId, updateBoardDto);
  }

  @ApiOperation({ summary: 'Delete a board' })
  @Delete(':boardId')
  async removeBoard(
    @CurrentUserId() user: string,
    @Param('boardId') boardId: string,
  ): Promise<Board> {
    return await this.boardsService.removeBoard(user, boardId);
  }

  @ApiOperation({ summary: 'Restore a deleted board' })
  @Patch('restore/:boardId')
  async restoreBoard(
    @CurrentUserId() user: string,
    @Param('boardId') boardId: string,
  ): Promise<UpdateResult> {
    return await this.boardsService.restoreBoard(user, boardId);
  }
}
