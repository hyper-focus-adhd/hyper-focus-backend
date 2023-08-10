import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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
    const board = this.boardRepository.create({
      title: createBoardDto.title,
      color: createBoardDto.color,
      userId: user,
    });

    return await this.boardRepository.save(board);
  }

  async findAllBoardsByUserId(userId: string): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      where: { userId: { id: userId } },
      relations: ['userId'],
    });

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
    userId: string,
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
      relations: ['userId'],
    });

    this.boardRepository.merge(board, updateBoardDto);

    return await this.boardRepository.save(board);
  }

  async removeBoard(userId: string, boardId: string): Promise<Board> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
      relations: ['notes'],
    });

    return await this.boardRepository.softRemove(board);
  }

  async restoreBoard(userId: string, boardId: string): Promise<UpdateResult> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
      withDeleted: true,
    });

    return await this.boardRepository.restore(board.id);
  }
}
