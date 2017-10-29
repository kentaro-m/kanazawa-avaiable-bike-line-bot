import request from 'request-promise';

const MESSAGE_API_ENDPOINT = 'https://api.line.me/v2/bot/message/reply';

export default class Line {
  constructor(token) {
    this.token = token;
  }

  async postMessage(replyToken, messages) {
    try {
      const options = {
        method: 'POST',
        uri: MESSAGE_API_ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: {
          replyToken,
          messages,
        },
        json: true,
      };

      await request(options);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
