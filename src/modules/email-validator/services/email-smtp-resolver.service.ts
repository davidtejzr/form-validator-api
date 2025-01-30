import { Injectable } from '@nestjs/common';
import * as net from 'node:net';

@Injectable()
export class EmailSmtpResolverService {
  async isEmailDeliverable(
    exchange: string,
    email: string,
  ): Promise<boolean | 'undeclared'> {
    const senderTest = 'test@gmail.com';
    let receivedData = false;
    let closed = false;
    let targetExchangeExists = false;

    return new Promise((resolve) => {
      const socket = net.createConnection(25, exchange);
      socket.setEncoding('utf-8');
      socket.setTimeout(10000);

      socket.on('error', (error) => {
        console.error(error);
        socket.emit('fail', error);
      });

      socket.on('close', (hadError) => {
        if (!receivedData && !hadError) {
          socket.emit(
            'fail',
            'Mail server closed connection without sending any data.',
          );
        }
        if (!closed) {
          socket.emit('fail', 'Mail server closed connection unexpectedly.');
        }
      });

      socket.once('fail', (msg) => {
        closed = true;
        if (socket.writable && !socket.destroyed) {
          socket.write(`quit\r\n`);
          socket.end();
          socket.destroy();
        }
        console.log('fail:', msg);
        if (msg === 'Timeout') {
          resolve('undeclared');
        }

        resolve(false);
      });

      socket.on('success', () => {
        closed = true;
        if (socket.writable && !socket.destroyed) {
          socket.write(`quit\r\n`);
          socket.end();
          socket.destroy();
        }
        console.log('success');
        if (!targetExchangeExists) {
          console.log('False positive result.');
          resolve('undeclared');
        }
        resolve(true);
      });

      const commands = [
        `helo ${exchange}\r\n`,
        `mail from: <${senderTest}>\r\n`,
        `rcpt to: <${email}>\r\n`,
      ];
      let i = 0;
      socket.on('next', () => {
        if (i < 3) {
          if (socket.writable) {
            socket.write(commands[i++]);
          } else {
            socket.emit('fail', 'SMTP communication unexpectedly closed.');
          }
        } else {
          socket.emit('success');
        }
      });

      socket.on('timeout', () => {
        socket.emit('fail', 'Timeout');
      });

      socket.on('connect', () => {
        socket.on('data', (msg) => {
          console.log('msg: ', msg);
          receivedData = true;
          if (this.hasCode(msg, 220) || this.hasCode(msg, 250)) {
            if (msg.includes('250 2.1.5')) {
              targetExchangeExists = true;
            }
            socket.emit('next', msg);
          } else if (this.hasCode(msg, 550)) {
            socket.emit('fail', 'Mailbox not found.');
          } else {
            console.log('msg:', msg);
          }
        });
      });
    });
  }

  private hasCode = (message: Buffer, code: number): boolean => {
    return (
      message.indexOf(`${code}`) === 0 || message.indexOf(`${code}\n`) > -1
    );
  };
}
