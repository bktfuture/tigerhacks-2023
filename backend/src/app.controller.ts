import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Room } from '@prisma/client';
import { memoryStorage } from 'multer';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { JoinRoomDTO } from './dtos';

@Controller()
export class AppController {
	constructor(private readonly service: AppService, private readonly gateway: AppGateway) {}

	@Post('/rooms')
	public async createRoom(): Promise<Room> {
		return this.service.createRoom();
	}

	@Post('/rooms/:id/join')
	public async joinRoom(@Param('id') id: string, @Body() { name }: JoinRoomDTO): Promise<{ otp: string }> {
		const player = await this.service.createPlayer(id, name);
		try {
			const otp = this.gateway.allocateOTP(id, player);

			return { otp };
		} catch (err) {
			await this.service.deletePlayer(id, player.id);
			throw err;
		}
	}

	@Post('/rooms/:id/submit')
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
	public submitRecording(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Body('id') userId: number): void {
		this.gateway.submitRecording(id, userId, file.buffer);
	}

	@Get('/rooms/:id/recordings/:playerId')
	public getRecording(@Param('id') roomId: string, @Param('playerId') playerId: number): StreamableFile {
		const recording = this.gateway.getRecording(roomId, playerId);

		return new StreamableFile(recording);
	}
}

