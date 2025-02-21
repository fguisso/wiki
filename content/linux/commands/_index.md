---
title: Comandos 
type: docs
---

### strace

```
strace <command>
```
comando para ver o trace de sistema do comando em questão.
ex: `strace curl http://localhost:80/`

Muito util quando a coisa baixa o nivel e você não sabe mais da onde ta vindo o bug.

### tcpdump

```
tcpdump -A host <host_target> &
```
comando para ficar escutando as conexões que baterem no target, muito util para debugar ferramentas que fazem requisição http. o `&` ao final é para deixar em background.

