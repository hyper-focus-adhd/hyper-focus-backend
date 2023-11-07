import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../../common/helpers/messages-helper';
import { BoardsService } from '../boards/boards.service';
import { User } from '../users/entities/user.entity';

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
    user: User,
    board: string,
    createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    const boardId = JSON.parse(JSON.stringify(board));

    await this.boardsService.findOneBoardOrFail({
      where: { id: board, user: { id: user.id } },
    });

    const note = this.noteRepository.create({
      ...createNoteDto,
      user: user,
      board: boardId,
    });

    const foundNote = await this.noteRepository.save(note);

    return this.findOneNoteOrFail({
      where: { id: foundNote.id },
      relations: ['user', 'board'],
    });
  }

  async findAllNotesByBoardId(user: string, board: string): Promise<Note[]> {
    const boards = await this.boardsService.findAllBoardsByUserId(user);

    const foundBoard = boards.find((findBoard) => findBoard.id === board);
    if (!foundBoard) {
      throw new NotFoundException(messagesHelper.BOARD_NOT_FOUND);
    }

    return await this.noteRepository.find({
      where: {
        board: { id: foundBoard.id },
      },
      relations: ['user', 'board'],
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
    user: string,
    board: string,
    noteId: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: board, user: { id: user } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, user: { id: user }, board: { id: board } },
      relations: ['user', 'board'],
    });

    this.noteRepository.merge(note, updateNoteDto);

    return await this.noteRepository.save(note);
  }

  async removeNote(
    user: string,
    board: string,
    noteId: string,
  ): Promise<UpdateResult> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: board, user: { id: user } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, user: { id: user }, board: { id: board } },
    });

    return await this.noteRepository.softDelete(note.id);
  }

  async restoreNote(
    user: string,
    board: string,
    noteId: string,
  ): Promise<UpdateResult> {
    await this.boardsService.findOneBoardOrFail({
      where: { id: board, user: { id: user } },
    });

    const note = await this.findOneNoteOrFail({
      where: { id: noteId, user: { id: user }, board: { id: board } },
      withDeleted: true,
    });

    return await this.noteRepository.restore(note.id);
  }
}
