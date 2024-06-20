import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';

import { CurrentUserId } from '../../common/decorators/current-user-id.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { User } from '../users/entities/user.entity';

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
  @Post(':board')
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUserId() user: User,
    @Param('board') board: string,
  ): Promise<Note> {
    return await this.notesService.createNote(user, board, createNoteDto);
  }

  @ApiOperation({ summary: 'Find all notes by board id' })
  @Get(':board')
  async findAllNotesByBoardId(
    @CurrentUserId() user: string,
    @Param('board') board: string,
  ): Promise<Note[]> {
    return await this.notesService.findAllNotesByBoardId(user, board);
  }

  @ApiOperation({ summary: 'Update a note' })
  @Patch(':board/:noteId')
  async updateNote(
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUserId() user: string,
    @Param('board') board: string,
    @Param('noteId') noteId: string,
  ): Promise<Note> {
    return await this.notesService.updateNote(user, board, noteId, updateNoteDto);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @Delete(':board/:noteId')
  async removeNote(
    @CurrentUserId() user: string,
    @Param('board') board: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.removeNote(user, board, noteId);
  }

  @ApiOperation({ summary: 'Restore a deleted note' })
  @Patch('restore/:board/:noteId')
  async restoreNote(
    @CurrentUserId() user: string,
    @Param('board') board: string,
    @Param('noteId') noteId: string,
  ): Promise<UpdateResult> {
    return await this.notesService.restoreNote(user, board, noteId);
  }
}
