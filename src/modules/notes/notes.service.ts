import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { BoardsService } from '../boards/boards.service';

import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    private readonly boardsService: BoardsService,
  ) {}

  async createNote(
    userId: string,
    board: string,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const boardId = JSON.parse(JSON.stringify(board));

    await this.boardsService.findOneBoardOrFail({
      where: { id: board, userId: { id: userId } },
    });

    const note = this.noteRepository.create({
      text: createNoteDto.text,
      color: createNoteDto.color,
      placement: createNoteDto.placement,
      boardId: boardId,
    });

    return await this.noteRepository.save(note);
  }

  async findAllNotesByBoardId(
    userId: string,
    boardId: string,
  ): Promise<Note[]> {
    const boards = await this.boardsService.findAllBoardsByUserId(userId);

    const foundBoard = boards.find((board) => board.id === boardId);
    if (!foundBoard) {
      throw new NotFoundException(messagesHelper.BOARD_NOT_FOUND);
    }

    return await this.noteRepository.find({
      where: {
        boardId: { id: foundBoard.id },
      },
      relations: ['boardId'],
    });
  }

  async findOneNoteOrFail(options: FindOneOptions<Note>): Promise<Note> {
    try {
      return await this.noteRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.NOTE_NOT_FOUND);
    }
  }

  async updateNote(
    userId: string,
    boardId: string,
    noteId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, boardId: { id: boardId } },
      relations: ['boardId'],
    });

    this.noteRepository.merge(note, updateNoteDto);

    return await this.noteRepository.save(note);
  }

  async removeNote(
    userId: string,
    boardId: string,
    noteId: string,
  ): Promise<UpdateResult> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, boardId: { id: boardId } },
    });

    return await this.noteRepository.softDelete(note.id);
  }

  async restoreNote(
    userId: string,
    boardId: string,
    noteId: string,
  ): Promise<UpdateResult> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: boardId, userId: { id: userId } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, boardId: { id: boardId } },
      withDeleted: true,
    });

    return await this.noteRepository.restore(note.id);
  }
}
