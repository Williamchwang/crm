# CORS问题解决方案

## 问题描述
CRM API (`https://api.xiaoshouyi.com`) 只允许同域名的请求，而本地开发服务器运行在 `http://localhost:8080`，导致CORS错误。

## 解决方案
已配置Vite代理来解决CORS问题：

1. **代理配置**：在 `vite.config.ts` 中添加了 `/crm-api` 代理
2. **URL修改**：将工单服务中的API URL从 `https://api.xiaoshouyi.com/rest/data/v2.0/query/xoql` 改为 `/crm-api/rest/data/v2.0/query/xoql`

## 代理工作原理

- 本地请求：`http://localhost:8080/crm-api/rest/data/v2.0/query/xoql`
- 代理转发到：`https://api.xiaoshouyi.com/rest/data/v2.0/query/xoql`
- 服务器响应通过代理返回给客户端

这样就绕过了CORS限制，因为请求看起来是从同一个域名发出的。
