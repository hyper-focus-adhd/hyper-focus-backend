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
import { User } from '../users/entities/user.entity';

import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

@Controller('api/v1/notes')
@Serialize(NoteDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async createNote(
    @Body() body: CreateNoteDto,
    @CurrentUserId() user: User,
  ): Promise<Note> {
    return await this.notesService.createNote(body, user);
  }

  @Get()
  async findAllNotesByUserId(@CurrentUserId() userId: string): Promise<Note[]> {
    return await this.notesService.findAllNotesByUserId({
      where: { user: { id: userId } },
    });
  }

  @Patch(':noteId')
  async updateNote(
    @Body() body: UpdateNoteDto,
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<Note> {
    return await this.notesService.updateNote(noteId, body, userId);
  }

  @Delete(':noteId')
  async removeNote(
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.removeNote(noteId, userId);
  }

  @Patch('restore/:noteId')
  async restoreNote(
    @CurrentUserId() userId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.restoreNote(noteId, userId);
  }
}
