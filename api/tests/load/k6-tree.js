import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/v1/tree?rootPath=root&maxDepth=2');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}