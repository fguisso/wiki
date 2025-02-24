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


### openssl - Gerar certificado autoassinado

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
```

Comando para gerar um certificado SSL autoassinado de forma não interativa. Parâmetros importantes:
- `-x509`: Indica que é um certificado autoassinado
- `-newkey rsa:4096`: Gera uma nova chave RSA de 4096 bits
- `-days 3650`: Validade de 10 anos
- `-nodes`: Sem senha para a chave privada
- `-subj`: Informações do certificado em uma única linha
  - `CN`: Pode ser um domínio wildcard como `*.local`

Gera dois arquivos:
- `key.pem`: Chave privada
- `cert.pem`: Certificado público

