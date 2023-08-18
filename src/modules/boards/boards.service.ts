import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
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
      user: user,
    });

    const foundBoard = await this.boardRepository.save(board);

    return this.findOneBoardOrFail({
      where: { id: foundBoard.id },
      relations: ['user'],
    });
  }

  async findAllBoardsByUserId(user: string): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      where: { user: { id: user } },
      relations: ['user'],
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
    user: string,
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: user } },
      relations: ['user'],
    });

    this.boardRepository.merge(board, updateBoardDto);

    return await this.boardRepository.save(board);
  }

  async removeBoard(user: string, boardId: string): Promise<Board> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: user } },
    });

    return await this.boardRepository.softRemove(board);
  }

  async restoreBoard(user: string, boardId: string): Promise<UpdateResult> {
    const board = await this.findOneBoardOrFail({
      where: { id: boardId, user: { id: user } },
      withDeleted: true,
    });

    return await this.boardRepository.restore(board.id);
  }
}
