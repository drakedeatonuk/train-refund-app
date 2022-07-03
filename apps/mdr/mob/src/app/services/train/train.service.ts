import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TrainAPI } from '@multi/mdr';
import { Result } from '@multi/shared';
import { HttpService } from '../../core/http/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  constructor(private httpSvc: HttpService) {}

  async findTrainJournies(query: TrainAPI.HSP.ServiceMetricsQuery): Promise<Result<string>> {
    return this.httpSvc.post<Result<string>>('/api/trains', { body: query });
  }
}

