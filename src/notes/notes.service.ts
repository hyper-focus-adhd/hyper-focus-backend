import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { User } from '../users/user.entity';

import { CreateNoteDto } from './dtos/create-note.dto';
import { Note } from './note.entity';

//TODO: Implement error verification
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly notesRepository: Repository<Note>,
  ) {}

  async create(noteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = await this.notesRepository.create(noteDto);

    note.user = user;

    return this.notesRepository.save(note);
  }

  async findAll(options?: FindManyOptions<Note>): Promise<Note[]> {
    return this.notesRepository.find(options);
  }

  async findOne(options: FindOneOptions<Note>): Promise<Note> {
    return this.notesRepository.findOne(options);
  }

  async update(id: string, attrs: Partial<Note>): Promise<Note> {
    const note = await this.findOne({ where: { id } });

    this.notesRepository.merge(note, attrs);

    return this.notesRepository.save(note);
  }

  async delete(id: string): Promise<UpdateResult> {
    const user = await this.findOne({ where: { id } });

    return this.notesRepository.softDelete(user.id);
  }

  async restore(id: string): Promise<UpdateResult> {
    const user = await this.findOne({ where: { id }, withDeleted: true });

    return this.notesRepository.restore(user.id);
  }
}
