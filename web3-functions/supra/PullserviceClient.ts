const axios = require('axios');

export class PullServiceClient {
  
  client:any;
  constructor(baseURL:any) {
    this.client = axios.create({
      baseURL: baseURL,
    });
  }

  async getProof(request:any) {
    try {
      const response = await this.client.post('/get_proof', request);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}

