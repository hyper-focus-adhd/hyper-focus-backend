import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { User } from '../users/entities/user.entity';

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
      const user = { id: '1', username: 'Test User' } as User;
      const noteToSave = {
        id: '1',
        text: 'Test note',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        user: user,
      } as Note;

      const createSpy = jest
        .spyOn(noteRepository, 'create')
        .mockResolvedValue(createNoteDto as never);
      const saveSpy = jest
        .spyOn(noteRepository, 'save')
        .mockResolvedValue(noteToSave);
      const createdNote = await notesService.createNote(createNoteDto, user);

      expect(createSpy).toHaveBeenCalledWith({
        text: createNoteDto.text,
        color: createNoteDto.color,
        placement: createNoteDto.placement,
      });
      expect(saveSpy).toHaveBeenCalledWith(noteToSave);
      expect(createdNote).toEqual(noteToSave);
    });
  });

  describe('findAllNotesByUserId', () => {
    it('should return an array of notes', async () => {
      const options = { where: { user: { id: '1' } } };
      const expectedNotes = [
        {
          id: '1',
          text: 'Note 1',
          color: 'yellow',
          placement: { x: 10, y: 20 },
          user: { id: '1', username: 'Test User' },
        } as Note,
        {
          id: '2',
          text: 'Note 2',
          color: 'blue',
          placement: { x: 20, y: 30 },
          user: { id: '1', username: 'Test User' },
        } as Note,
      ];

      const findSpy = jest
        .spyOn(noteRepository, 'find')
        .mockResolvedValue(expectedNotes);
      const notes = await notesService.findAllNotesByUserId(options);

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
      const userId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        user: { id: userId, username: 'Test User' },
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
        noteId,
        updateNoteDto,
        userId,
      );

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, user: { id: userId } },
      });
      expect(mergeSpy).toHaveBeenCalledWith(existingNote, updateNoteDto);
      expect(saveSpy).toHaveBeenCalledWith(existingNote);
      expect(updatedNote).toEqual(existingNote);
    });
  });

  describe('removeNote', () => {
    it('should soft delete the specified note', async () => {
      const noteId = '1';
      const userId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        user: { id: userId, username: 'Test User' },
      } as Note;

      const findOneSpy = jest
        .spyOn(noteRepository, 'findOneOrFail')
        .mockResolvedValue(existingNote);
      const softDeleteSpy = jest
        .spyOn(noteRepository, 'softDelete')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await notesService.removeNote(noteId, userId);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, user: { id: userId } },
      });
      expect(softDeleteSpy).toHaveBeenCalledWith(existingNote.id);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('restoreNote', () => {
    it('should restore the specified note', async () => {
      const noteId = '1';
      const userId = '1';
      const existingNote = {
        id: noteId,
        text: 'Note 1',
        color: 'yellow',
        placement: { x: 10, y: 20 },
        user: { id: userId, username: 'Test User' },
      } as Note;

      const findOneSpy = jest
        .spyOn(notesService, 'findOneNoteOrFail')
        .mockResolvedValue(existingNote);
      const restoreSpy = jest
        .spyOn(noteRepository, 'restore')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await notesService.restoreNote(noteId, userId);

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: noteId, user: { id: userId } },
        withDeleted: true,
      });
      expect(restoreSpy).toHaveBeenCalledWith(existingNote.id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
