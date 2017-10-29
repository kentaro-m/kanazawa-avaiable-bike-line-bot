import request from 'request-promise';

const MACHINORI_API_ENDPOINT = 'https://interstreet.jp/kanazawa/api/get_info';

export default class Machinori {
  static async fetchData() {
    try {
      const response = await request(MACHINORI_API_ENDPOINT);
      const ports = JSON.parse(response);
      return ports;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
