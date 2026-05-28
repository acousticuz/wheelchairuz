import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inquiry } from '../inquiries/inquiry.entity';

type TelegramSendMessageResponse = {
  ok: boolean;
  result?: { message_id?: number };
  description?: string;
};

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private token: string | null = null;
  private adminChatId: string;
  private isEnabled = false;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const token = this.configService.get<string>('app.telegram.botToken');
    this.adminChatId = this.configService.get<string>('app.telegram.adminChatId');

    if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
      this.logger.warn('Telegram bot token not configured — notifications disabled');
      return;
    }

    if (!this.adminChatId || this.adminChatId === 'YOUR_TELEGRAM_CHAT_ID_HERE') {
      this.logger.warn('Telegram admin chat ID not configured — notifications disabled');
      return;
    }

    this.token = token;
    this.isEnabled = true;
    this.logger.log('Telegram notifications enabled');
  }

  private async sendMessage(chatId: string, text: string, replyMarkup?: unknown): Promise<number | null> {
    if (!this.isEnabled || !this.token) return null;

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          reply_markup: replyMarkup,
        }),
      });
      const data = (await response.json()) as TelegramSendMessageResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.description || `HTTP ${response.status}`);
      }
      return data.result?.message_id || null;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.error(`Telegram sendMessage failed: ${reason}`);
      return null;
    }
  }

  async sendNewInquiryNotification(inquiry: Inquiry): Promise<number | null> {
    if (!this.isEnabled) return null;

    const timeStr = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const text = [
      "Yangi so'rov keldi!",
      '━━━━━━━━━━━━━━━━━━━━',
      `Ism: ${inquiry.firstName} ${inquiry.lastName}`,
      `Telefon: ${inquiry.phone}`,
      inquiry.email ? `Email: ${inquiry.email}` : '',
      inquiry.productName ? `Mahsulot: ${inquiry.productName}` : '',
      inquiry.message
        ? `Xabar:\n${inquiry.message.slice(0, 300)}${inquiry.message.length > 300 ? '...' : ''}`
        : '',
      '━━━━━━━━━━━━━━━━━━━━',
      timeStr,
      `ID: ${inquiry.id.slice(0, 8)}`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.sendMessage(this.adminChatId, text, {
      inline_keyboard: [[{ text: "Qo'ng'iroq qilish", url: `tel:${inquiry.phone}` }]],
    });
  }

  async sendStatusUpdate(chatId: string, message: string): Promise<void> {
    await this.sendMessage(chatId, message);
  }

  async sendTestMessage(): Promise<boolean> {
    const messageId = await this.sendMessage(this.adminChatId, 'wheelchair.uz — Bot muvaffaqiyatli ulandi!');
    return Boolean(messageId);
  }
}
