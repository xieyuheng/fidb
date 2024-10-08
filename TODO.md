看以下 bun 的 API：https://bun.sh/docs/api/http

- 如果能避免用 node:http 中愚蠢的的

  ```typescript
  request: Http.IncomingMessage
  response: Http.ServerResponse
  ```

  而是使用 Web API 的标准，

  ```typescript
  request: Request
  response: Response
  ```

  那将是极好的。

# examples

[examples] mimor
- 要能 publish 到稳定的 url
- 别忘了 recall，现在的实现方式也不好。
[examples] mimorhub -- 带有社交功能 -- 也许这个 app 足够一般了
- like 功能
- follow 功能 -- `following` & `followed-by` -- 这里如何处理权限问题？
[examples] pomodoro
[examples] x-calendar
[examples] x-blog -- twitter-like -- user has friends
- 这里主要是要实现评论功能。

# db

[db] `Database` interface
[db] `FiDB` class
