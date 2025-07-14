import { ReturnLastSevenDays } from '../interface/callsLastSevenDays.interface';

export class LastSevenCallsDto {
  data: string;
  total: number;

  constructor(calls: ReturnLastSevenDays) {
    this.data = calls.data;
    this.total = calls.total;
  }
}
