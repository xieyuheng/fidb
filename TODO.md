开启新的 fidb-next -- 这次做成 library 而不是 app
```
git remote add origin git@github.com:fidb-official/fidb-next.git
git push -u origin master
```
setup git
setup typescript
撰写新计划书
- 应该用 OOP 的方式来实现基础数据层的 API，
  因为 Db 显然是一个正经的 interface，FiDB 是它的自类型。
- 用 double linked 而不是 path-based permission
  - 允许不一致性，不一致性在 UI 上显示出来，
    比如一个 mimor 对某个 user 取消了权限，
    user 还能在自己的 mimor 列表中看到这个 mimor 的旧名字，
    但是没法读写（可能可以读）只能选择删除这个 item 了。
  - 用起来的感觉可能像是 graph 而不是 relational database
- 先放弃 file 相关的 API
  - 因为想要用 file 处理的是 pdf 之类的文件，
    而这些文件最好用 content hash 作为 id 来保存，以避免重复。
    可以外加 tags 来做索引。
通过给不同类型的 app 的数据层建模，来检验 fidb 的可用性
- mimor
  - mimor 带有社交功能的，有 like 和 follow 等等
    也许这个 app 足够一般了。
    别忘了 recall，现在的实现方式也不好。
- readonly
- pomodoro
- x-calendar
- x-blog -- twitter-like -- user has friends
  - `following` and `followed-by` relation
    这里如何处理权限问题？
fidb.app
- just a simple frontend for viewing database
- no hosting feature
用 pattern 的形式总结 http-resource-patterns
- users/ 是很特殊的：

  > Note that, we can only express relations between something with user.
  >
  > Because the target of access control is a user.
  >
  > This is not a bad limitation,
  > because we are using a client/server architechure,
  > in which every request is sent by a user or a guest.

  可能需要再次回顾旧笔记：2023-10-14-implementing-relations.md
  并且撰写一写到新笔记。
