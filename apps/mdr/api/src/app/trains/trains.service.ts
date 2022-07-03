import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios";
import { TrainAPI } from "@multi/mdr";
@Injectable()
export class TrainsService {

  constructor(private httpService: HttpService){}

  async findHSPTrainJournies(query: TrainAPI.HSP.ServiceMetricsQuery) {//: AxiosResponse
    try {
      const key = Buffer.from(
        `${process.env.TRAIN_HSP_USERNAME}:${process.env.TRAIN_HSP_PASSWORD}`
      ).toString('base64');
      this.httpService.post<AxiosResponse>('https://hsp-prod.rockshore.net/api/v1/serviceMetrics', JSON.stringify(query), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${key}`
        }
      }).subscribe(e => console.log(e.data));
    } catch (e) {
      return e;
    }
  }

  findHSPJournyDetails(){
    //https://hsp-prod.rockshore.net/api/v1/serviceDetails
  }

  findRTJPTrainJourney(){}

}
