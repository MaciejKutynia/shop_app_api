import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlackListModel } from '../entities/tokenBlackList.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenBlackListService {
  constructor(
    @InjectRepository(TokenBlackListModel)
    private readonly tokenBlackListRepository: Repository<TokenBlackListModel>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Checks all tokens in the blacklist and deletes the invalid ones.
   * @returns {Promise<void>}
   */
  public async checkTokens() {
    const tokens = await this.getAllTokens();
    for (const { token } of tokens) {
      const isTokenValid = await this.validateToken(token);
      if (!isTokenValid) {
        await this.deleteToken(token);
      }
    }
  }

  /**
   * Adds a token to the blacklist.
   * @param {string} token - The token to be added.
   * @returns {Promise<TokenBlackListModel>} - The saved token model.
   */
  public async addToken(token: string): Promise<TokenBlackListModel> {
    return this.tokenBlackListRepository.save({ token });
  }

  /**
   * Checks if a token exists in the blacklist.
   * @param {string} token - The token to be checked.
   * @returns {Promise<boolean>} - True if the token exists, false otherwise.
   */
  public async checkToken(token: string): Promise<boolean> {
    const tokenExists = await this.tokenBlackListRepository.findOne({
      where: { token },
    });
    return !!tokenExists;
  }

  /**
   * Retrieves all tokens from the blacklist.
   * @returns {Promise<TokenBlackListModel[]>} - An array of token models.
   */
  private async getAllTokens(): Promise<TokenBlackListModel[]> {
    return this.tokenBlackListRepository.find();
  }

  /**
   * Deletes a token from the blacklist.
   * @param {string} token - The token to be deleted.
   * @returns {Promise<string>} - A success message.
   */
  private async deleteToken(token: string): Promise<string> {
    await this.tokenBlackListRepository.delete({ token });
    return 'success';
  }

  /**
   * Validates a token.
   * @param {string} token - The token to be validated.
   * @returns {Promise<boolean>} - True if the token is valid, false otherwise.
   */
  private async validateToken(token: string): Promise<boolean> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      return !!decodedToken;
    } catch (e) {
      console.log('Error validating token: ', e);
      return false;
    }
  }
}
