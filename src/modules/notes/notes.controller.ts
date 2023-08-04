import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../interceptors/serialize.interceptor';

import { CreateNoteDto } from './dtos/create-note.dto';
import { NoteDto } from './dtos/note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

@ApiTags('Note')
@ApiSecurity('Access Token')
@Controller('api/v1/notes')
@Serialize(NoteDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Create a new note' })
  @Post(':boardId')
  async createNote(
    @Body() body: CreateNoteDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Note> {
    return await this.notesService.createNote(userId, boardId, body);
  }

  @ApiOperation({ summary: 'Find all notes by board id' })
  @Get(':boardId')
  async findAllNotesByBoardId(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
  ): Promise<Note[]> {
    return await this.notesService.findAllNotesByBoardId(userId, boardId);
  }

  @ApiOperation({ summary: 'Update a note' })
  @Patch(':boardId/:noteId')
  async updateNote(
    @Body() body: UpdateNoteDto,
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<Note> {
    return await this.notesService.updateNote(userId, boardId, noteId, body);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @Delete(':boardId/:noteId')
  async removeNote(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.removeNote(userId, boardId, noteId);
  }

  @ApiOperation({ summary: 'Restore a deleted note' })
  @Patch('restore/:boardId/:noteId')
  async restoreNote(
    @CurrentUserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.restoreNote(userId, boardId, noteId);
  }
}
