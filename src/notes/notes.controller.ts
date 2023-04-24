import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/user.entity';

import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './note.entity';
import { NotesService } from './notes.service';

@Controller('api/v1/notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post()
  @Serialize(NoteDto)
  async createNote(
    @CurrentUser() user: User,
    @Body() body: CreateNoteDto,
  ): Promise<Note> {
    return await this.noteService.create(body, user);
  }

  // @Get(':userId')
  // async getNotesByUserId(@Param('userId') userId: string): Promise<Note[]> {
  //   return this.noteService.findAll({ where: { userId } });
  // }

  @Patch(':userId/:noteId')
  async updateNote(
    @Param('noteId') noteId: string,
    @Body() body: UpdateNoteDto,
  ): Promise<Note> {
    return await this.noteService.update(noteId, body);
  }

  @Delete(':userId/:noteId')
  async deleteNote(@Param('noteId') noteId: string): Promise<UpdateResult> {
    return await this.noteService.delete(noteId);
  }

  // TODO: finish
  // @Patch('restore/:id')
  // async restoreUser(@Param('id') id: string): Promise<UpdateResult> {
  //   return await this.usersService.restore(id);
  // }
}
