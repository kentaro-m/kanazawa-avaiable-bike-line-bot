import underscore from 'underscore';

import Line from './line';
import Machinori from './machinori';
import { buildCarouselMessages, createDistanceData } from './utils';

const MESSAGE_API_TOKEN = process.env.MESSAGE_API_TOKEN || '';

async function handleLocationMessage(payload, callback) {
  try {
    const message = payload.message;
    const line = new Line(MESSAGE_API_TOKEN);
    if (message.address.match(/金沢市/) === null) {
      const noticeMessages = [{
        type: 'text',
        text: '金沢市内からご利用ください',
      }];
      await line.postMessage(payload.replyToken, noticeMessages);
      return callback(null, { message: '現在地が金沢市外なので処理完了' });
    }

    const ports = await Machinori.fetchData();
    const presentLocation = { latitude: message.latitude, longitude: message.longitude };
    const distanceData = createDistanceData(ports, presentLocation);

    if (distanceData.length > 0) {
      const sortedData = underscore.sortBy(distanceData, data => data.distance);
      const availableMessages = buildCarouselMessages(sortedData, presentLocation);
      await line.postMessage(payload.replyToken, availableMessages);

      return callback(null, { message: '空きポート情報を送信して処理完了' });
    }

    const errorMessages = [{
      type: 'text',
      text: 'ご案内できるポートがありませんでした。\n\nしばらく時間をおいてから試してみてください。',
    }];
    await line.postMessage(payload.replyToken, errorMessages);
    return callback(null, { message: 'エラー情報を送信して処理完了' });
  } catch (error) {
    return callback(new Error(error.message));
  }
}

async function handleDefaultMessage(payload, callback) {
  try {
    const line = new Line(MESSAGE_API_TOKEN);
    const noticeMessages = [{
      type: 'text',
      text: '現在地を送信いただくと、お近くの貸出可能なポートをご案内いたします。\n\n▼まちのり公式サイト\nhttp://www.machi-nori.jp/',
    }];
    await line.postMessage(payload.replyToken, noticeMessages);
    return callback(null, { message: 'メッセージタイプがlocation以外なので処理完了' });
  } catch (error) {
    return callback(new Error(error.message));
  }
}

exports.handler = async (event, context, callback) => {
  const payload = event.events[0];

  if (payload.message.type === 'location') {
    await handleLocationMessage(payload, callback);
  }

  await handleDefaultMessage(payload, callback);
};
