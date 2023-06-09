import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { messagesHelper } from '../helpers/messages-helper';
import { User } from '../users/entities/user.entity';

import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
  ) {}

  async createNote(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = await this.noteRepository.create({
      text: createNoteDto.text,
      color: createNoteDto.color,
      placement: createNoteDto.placement,
    });

    note.user = user;

    return await this.noteRepository.save(note);
  }

  async findAllNotesByUserId(options?: FindManyOptions<Note>): Promise<Note[]> {
    return await this.noteRepository.find(options);
  }

  async findOneNoteOrFail(options: FindOneOptions<Note>): Promise<Note> {
    try {
      return await this.noteRepository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new NotFoundException(messagesHelper.NOTE_NOT_FOUND);
    }
  }

  async updateNote(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOneNoteOrFail({
      where: { id: noteId, user: { id: userId } },
    });

    this.noteRepository.merge(note, updateNoteDto);

    return await this.noteRepository.save(note);
  }

  async removeNote(noteId: string, userId: string): Promise<UpdateResult> {
    const note = await this.noteRepository.findOneOrFail({
      where: { id: noteId, user: { id: userId } },
    });

    return await this.noteRepository.softDelete(note.id);
  }

  async restoreNote(noteId: string, userId: string): Promise<UpdateResult> {
    const note = await this.findOneNoteOrFail({
      where: { id: noteId, user: { id: userId } },
      withDeleted: true,
    });

    return await this.noteRepository.restore(note.id);
  }
}
