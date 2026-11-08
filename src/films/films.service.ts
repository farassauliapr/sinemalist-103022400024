import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilmsService {
  private films: any[] = [];

  constructor() {
    const dataPath = path.join(process.cwd(), 'src', 'films.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    this.films = JSON.parse(rawData);
  }

  findAll(ditonton?: string) {
    if (ditonton === 'true') {
      return this.films.filter((film) => film.sudahDitonton === true);
    } else if (ditonton === 'false') {
      return this.films.filter((film) => film.sudahDitonton === false);
    }
    return this.films;
  }

  findOne(id: string) {
    const film = this.films.find((f) => f.id === id);
    if (!film) {
      throw new NotFoundException(`Film dengan ID ${id} tidak ditemukan`);
    }
    return film;
  }

  create(createFilmDto: CreateFilmDto) {
    const newFilm = {
      id: Date.now().toString(),
      ...createFilmDto,
      sudahDitonton: createFilmDto.sudahDitonton ?? false,
    };
    this.films.push(newFilm);
    return newFilm;
  }

  updateStatus(id: string, sudahDitonton: boolean) {
    const film = this.findOne(id);
    film.sudahDitonton = sudahDitonton;
    return film;
  }

  remove(id: string) {
    const index = this.films.findIndex((f) => f.id === id);
    if (index === -1) {
      throw new NotFoundException(`Film dengan ID ${id} tidak ditemukan`);
    }
    this.films.splice(index, 1);
    return { message: 'Film berhasil dihapus' };
  }
}