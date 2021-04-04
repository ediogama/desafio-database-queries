import { clear } from 'node:console';
import { getRepository, ILike, Like, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository.find({title: ILike(`%${param}%`)});
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT COUNT(id) from "games"');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .select(["email", "first_name", "last_name"])
      .innerJoinAndSelect("games.users", "users", "games.id = :id", {id: id})
      .getRawMany()
  }
}
