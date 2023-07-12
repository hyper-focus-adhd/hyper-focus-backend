import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardsService } from '../boards/boards.service';
import { Board } from '../boards/entities/board.entity';

import { Note } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Note])],
  controllers: [NotesController],
  providers: [BoardsService, NotesService],
})
export class NotesModule {}
