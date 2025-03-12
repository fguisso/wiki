---
title: Comandos 
type: docs
---

### Listar portas

1. **`ss -l`**  
   O comando `ss -l` lista todas as portas que estão **escutando** (listening) no sistema. Isso é útil para ver quais serviços estão esperando conexões de rede.

2. **`lsof -i -P`**  
   O comando `lsof -i -P` mostra quais **processos** estão usando conexões de rede ou portas abertas. Ele exibe qual programa está associado a qual porta/IP.  
   - A opção `-P` impede que o `lsof` converta números de portas para nomes (por exemplo, `80` em vez de `http`).

---

### Procurando o arquivo em todo o sistema:

Use o comando abaixo para procurar o arquivo em qualquer diretório:

```bash
find / -type f -name "server.env"
```

Explicação:
- `/` → Começa a busca desde a raiz do sistema.
- `-type f` → Busca apenas arquivos (ignora diretórios).
- `-name "server.env"` → Procura pelo nome exato do arquivo.

Se quiser buscar por um nome parecido, use `-iname` (ignora maiúsculas e minúsculas):

```bash
find / -type f -iname "server.env"
```

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

