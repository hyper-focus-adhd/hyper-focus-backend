import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/user.entity';

import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './note.entity';
import { NotesService } from './notes.service';

@Controller('api/v1/note')
@Serialize(NoteDto)
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post()
  async createNote(
    @Body() body: CreateNoteDto,
    @CurrentUserId() userId: User,
  ): Promise<Note> {
    return await this.noteService.create(body.text, body.color, userId);
  }

  @Get()
  async getNotesByUserId(@CurrentUserId() userId: string): Promise<Note[]> {
    return this.noteService.findAllByUser({ where: { user: { id: userId } } });
  }

  @Patch(':noteId')
  async updateNote(
    @Body() body: UpdateNoteDto,
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<Note> {
    return await this.noteService.update(noteId, body, userId);
  }

  @Delete(':noteId')
  async deleteNote(
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.noteService.delete(noteId, userId);
  }

  @Patch('restore/:noteId')
  async restoreNote(
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.noteService.restore(noteId, userId);
  }
}
