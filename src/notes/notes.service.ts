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
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = await this.notesRepository.create({
      text: createNoteDto.text,
      color: createNoteDto.color,
      placement: createNoteDto.placement,
    });

    note.user = user;

    return this.notesRepository.save(note);
  }

  async findAllByUser(options?: FindManyOptions<Note>): Promise<Note[]> {
    return this.notesRepository.find(options);
  }

  async findOneOrFail(options: FindOneOptions<Note>): Promise<Note> {
    try {
      return await this.notesRepository.findOneOrFail(options);
    } catch (error: any) {
      throw new NotFoundException(messagesHelper.NOTE_NOT_FOUND);
    }
  }

  async update(
    noteId: string,
    updateNoteDto: UpdateNoteDto,
    userId: string,
  ): Promise<Note> {
    const note = await this.findOneOrFail({
      where: { id: noteId, user: { id: userId } },
    });

    this.notesRepository.merge(note, updateNoteDto);

    return this.notesRepository.save(note);
  }

  async delete(noteId: string, userId: string): Promise<UpdateResult> {
    const note = await this.notesRepository.findOneOrFail({
      where: { id: noteId, user: { id: userId } },
    });

    return this.notesRepository.softDelete(note.id);
  }

  async restore(noteId: string, userId: string): Promise<UpdateResult> {
    const note = await this.findOneOrFail({
      where: { id: noteId, user: { id: userId } },
      withDeleted: true,
    });

    return this.notesRepository.restore(note.id);
  }
}
