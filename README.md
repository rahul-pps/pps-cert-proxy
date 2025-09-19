# PPS Certificate Proxy

This project proxies requests like `/cert/Cert1` to a Google Apps Script backend,
while keeping the branded URL `verify.ppsconsulting.biz`.

- `/health` → health check
- `/cert/<CertID>` → certificate verification page
