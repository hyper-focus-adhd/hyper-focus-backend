import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async createBoard(
    user: User,
    createBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const board = await this.boardRepository.create({
      title: createBoardDto.title,
      color: createBoardDto.color,
    });

    board.user = user;

    return await this.boardRepository.save(board);
  }

  async findAllBoardsByUserId(
    options?: FindManyOptions<Board>,
  ): Promise<Board[]> {
    const boards = await this.boardRepository.find(options);

    if (!boards.length) {
      throw new NotFoundException(messagesHelper.BOARD_NOT_FOUND);
    }

    return boards;
  }

  async findOneBoardOrFail(options: FindOneOptions<Board>): Promise<Board> {
    try {
      return await this.boardRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.BOARD_NOT_FOUND);
    }
  }

  async updateBoard(
    boardId: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: userId } },
    });

    this.boardRepository.merge(board, updateBoardDto);

    return await this.boardRepository.save(board);
  }

  async removeBoard(userId: string, boardId: string): Promise<UpdateResult> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: userId } },
    });

    return await this.boardRepository.softDelete(board.id);
  }

  async restoreBoard(userId: string, boardId: string): Promise<UpdateResult> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: userId } },
      withDeleted: true,
    });

    return await this.boardRepository.restore(board.id);
  }
}
