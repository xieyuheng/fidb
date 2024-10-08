---
title: Implementing relations
author: Xie Yuheng
date: 2023-10-14
---

We can implement relations between user and user
by making a `relations/{relation-name}/` directory for each user,
and give other users the permission
to edit `relations/{relation-name}/{other-user}`.

- Note that, the `relations/` prefix is not necessary,
  it is only there to denote that path under this prefix
  are ought to grant permissions to other users.

This means we are implementing relations by double-links.

Take the `following` and `followed-by` relation as an example:

```
users/{other-user}/following/{user}/index.json
users/{user}/relations/followed-by/{other-user}/index.json
```

- Problem: Should we use `followed-by` or `followers`
  to name this direction of the relation?

  Maybe we should use `followed-by` because it is more general,
  for example we can use `liked-by` but not `likers`.

To implement relations between content (file resource) and user,
we can use a `content-relations/` directory
and use `path-hash` to reference path of a content.

We must use `path-hash` because
path might contains the "/" character,
thus can not be used as part of a path.

```
users/{other-user}/liking/{path-hash}/index.json
users/{user}/public/contents/{path}
users/{user}/public/content-relations/{path-hash}/liked-by/{other-user}/index.json
```

This means we store metadata of file by a parallel data directory.
Just like how the recall feature of mimor is implemented:

```
users/{user}/recall/{src-hash}/index.json
```

# Limitation

Note that, we can only express relations between something with user.

Because the target of access control is a user.

This is not a bad limitation,
because we are using a client/server architechure,
in which every request is sent by a user or a guest.

# Check consistency during reading

Since a double-link is built by two requests,
when the first request success but the second fail,
the state of the double-link will be inconsistent.

We can solve this problem by checking consistency
during reading the first endpoint of the double-link,
and amend the double-link if it is broken.

# Properties of double-link method for implementing relations

We do not need to use index to get all the users a user is following,
or all the followers of a user.

both direction of a relation must be explicitly named.

# Motivating constraint

The motivating constraint of the idea of double-link,
is the fact that we are using path pattern to represent permissions.
