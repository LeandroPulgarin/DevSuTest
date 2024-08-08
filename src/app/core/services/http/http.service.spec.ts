import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpService } from './http.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';

describe('HttpService', () => {
  let httpService: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    httpService = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(httpService).toBeTruthy();
  });

  it('should perform a GET request', () => {
    const testData = { name: 'Test Product' };
    const endpoint = 'products/test';

    httpService.doGet(endpoint).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should perform a POST request', () => {
    const testData = { id: '1', name: 'New Product' };
    const endpoint = 'products';
    const body = { name: 'New Product' };

    httpService.doPost(endpoint, body).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a PUT request', () => {
    const testData = { id: '1', name: 'Updated Product' };
    const endpoint = 'products/1';
    const body = { name: 'Updated Product' };

    httpService.doPut(endpoint, body).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should perform a DELETE request', () => {
    const endpoint = 'products/1';

    httpService.doDelete(endpoint).subscribe((data) => {
      expect(data).toBe('');
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toEqual('DELETE');
    req.flush('');
  });

  it('should perform a PATCH request', () => {
    const testData = { id: '1', name: 'Partially Updated Product' };
    const endpoint = 'products/1';
    const body = { name: 'Partially Updated Product' };

    httpService.doPatch(endpoint, body).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush(testData);
  });

  it('should include headers and params in GET request', () => {
    const testData = { name: 'Test Product' };
    const endpoint = 'products/test';
    const headers = new HttpHeaders({ 'Custom-Header': 'value' });
    const params = new HttpParams().set('param1', 'value1');

    httpService.doGet(endpoint, params, headers).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/${endpoint}?param1=value1`
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get('Custom-Header')).toEqual('value');
    req.flush(testData);
  });
});
