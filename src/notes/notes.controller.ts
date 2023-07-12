import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { Board } from '../boards/entities/board.entity';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';

import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

@ApiTags('Note')
@Controller('api/v1/notes')
@Serialize(NoteDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':boardId')
  async createNote(
    @Body() body: CreateNoteDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: Board,
  ): Promise<Note> {
    return await this.notesService.createNote(userId, boardId, body);
  }

  @Get(':boardId')
  async findAllNotesByBoardId(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Note[]> {
    return await this.notesService.findAllNotesByBoardId(userId, boardId);
  }

  @Patch(':boardId/:noteId')
  async updateNote(
    @Body() body: UpdateNoteDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<Note> {
    return await this.notesService.updateNote(userId, boardId, noteId, body);
  }

  @Delete(':boardId/:noteId')
  async removeNote(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.removeNote(userId, boardId, noteId);
  }

  @Patch('restore/:boardId/:noteId')
  async restoreNote(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.restoreNote(userId, boardId, noteId);
  }
}
