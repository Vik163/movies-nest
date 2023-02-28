import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

// Подтверждение с запросом по ссылке 'activate/:link'  через почту яндекса ===
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  // - link параметр запроса ---
  public sendActivationMail(to: string, link: string): void {
    this.mailerService
      .sendMail({
        to: 'sfoto116@yandex.ru', // Временно, потом параметр to
        from: process.env.SMTP_USER, // sender address
        subject: 'Проверка аутентификации ✔', // Шапка сообщения
        text: '', // plaintext body
        html: `
              <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
              </div>
              `, // HTML body content
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .then((data) => {
        console.log(data.envelope);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
