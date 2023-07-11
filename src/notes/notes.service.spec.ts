import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { Board } from '../boards/entities/board.entity';

import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';

//TODO: finish unit test
describe('NotesService', () => {
  let notesService: NotesService;
  let noteRepository: Repository<Note>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useClass: Repository,
        },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNoteDto = {
        id: '1',
        text: 'Test note',
        color: 'yellow',
        placement: { x: 10, y: 20 },
      };
      const board = { id: '1', title: 'Test Board' } as Board;
      const noteToSave = {
        id: '1',
        text: 'Test note',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        board: board,
      } as Note;

      const createSpy = jest
        .spyOn(noteRepository, 'create')
        .mockResolvedValue(createNoteDto as never);
      const saveSpy = jest
        .spyOn(noteRepository, 'save')
        .mockResolvedValue(noteToSave);
      const createdNote = await notesService.createNote(createNoteDto, board);

      expect(createSpy).toHaveBeenCalledWith({
        text: createNoteDto.text,
        color: createNoteDto.color,
        placement: createNoteDto.placement,
      });
      expect(saveSpy).toHaveBeenCalledWith(noteToSave);
      expect(createdNote).toEqual(noteToSave);
    });
  });

  describe('findAllNotesByBoardId', () => {
    it('should return an array of notes', async () => {
      const options = { where: { board: { id: '1' } } };
      const expectedNotes = [
        {
          id: '1',
          text: 'Note 1',
          color: 'yellow',
          placement: { x: 10, y: 20 },
          board: { id: '1', title: 'Test Board' },
        } as Note,
        {
          id: '2',
          text: 'Note 2',
          color: 'blue',
          placement: { x: 20, y: 30 },
          board: { id: '1', title: 'Test Board' },
        } as Note,
      ];

      const findSpy = jest
        .spyOn(noteRepository, 'find')
        .mockResolvedValue(expectedNotes);
      const notes = await notesService.findAllNotesByBoardId(options);

      expect(findSpy).toHaveBeenCalledWith(options);
      expect(notes).toEqual(expectedNotes);
    });
  });

  describe('updateNote', () => {
    it('should update the specified note', async () => {
      const noteId = '1';
      const updateNoteDto = {
        text: 'Updated note',
      } as UpdateNoteDto;
      const boardId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        board: { id: boardId, title: 'Test Board' },
      } as Note;

      const findOneSpy = jest
        .spyOn(notesService, 'findOneNoteOrFail')
        .mockResolvedValue(existingNote);
      const mergeSpy = jest
        .spyOn(noteRepository, 'merge')
        .mockResolvedValue(existingNote as never);
      const saveSpy = jest
        .spyOn(noteRepository, 'save')
        .mockResolvedValue(existingNote);
      const updatedNote = await notesService.updateNote(
        boardId,
        noteId,
        updateNoteDto,
      );

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, board: { id: boardId } },
      });
      expect(mergeSpy).toHaveBeenCalledWith(existingNote, updateNoteDto);
      expect(saveSpy).toHaveBeenCalledWith(existingNote);
      expect(updatedNote).toEqual(existingNote);
    });
  });

  describe('removeNote', () => {
    it('should soft delete the specified note', async () => {
      const noteId = '1';
      const boardId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        board: { id: boardId, title: 'Test Board' },
      } as Note;

      const findOneSpy = jest
        .spyOn(noteRepository, 'findOneOrFail')
        .mockResolvedValue(existingNote);
      const softDeleteSpy = jest
        .spyOn(noteRepository, 'softDelete')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await notesService.removeNote(boardId, noteId);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, board: { id: boardId } },
      });
      expect(softDeleteSpy).toHaveBeenCalledWith(existingNote.id);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('restoreNote', () => {
    it('should restore the specified note', async () => {
      const noteId = '1';
      const boardId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        board: { id: boardId, title: 'Test Board' },
      } as Note;

      const findOneSpy = jest
        .spyOn(notesService, 'findOneNoteOrFail')
        .mockResolvedValue(existingNote);
      const restoreSpy = jest
        .spyOn(noteRepository, 'restore')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await notesService.restoreNote(boardId, noteId);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, board: { id: boardId } },
        withDeleted: true,
      });
      expect(restoreSpy).toHaveBeenCalledWith(existingNote.id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
