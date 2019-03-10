import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading = false;

  constructor() {
  }

  setLoading(status: boolean) {
    this.loading = status;
  }
}
