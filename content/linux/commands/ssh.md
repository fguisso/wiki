---
title: ssh 
type: docs
---

## Login do Codex CLI via SSH com OIDC (usando túnel local)

### Contexto

 O comando `codex login` utiliza o padrão **OIDC (OpenID Connect)** para autenticação.  
 Durante o processo, o Codex CLI:

1. Abre um **servidor HTTP local** em uma porta aleatória (geralmente `1455`).
2. Exibe uma URL para ser aberta no navegador.
3. Após o login, o navegador redireciona para `http://localhost:<porta>` enviando o código de autenticação.
4. O CLI escuta nessa porta para capturar o código e concluir o login.

### O problema ao usar SSH

Quando o comando é executado dentro de uma sessão SSH, o **servidor HTTP local** é aberto no **localhost da máquina remota**, e não no dispositivo local (neste caso, o iPhone ou iPad).  
Assim, o navegador local (Safari) não consegue se conectar a `localhost:<porta>` no servidor remoto, e o callback do OIDC falha.

### Solução: redirecionamento de porta com `ssh -L`

O SSH permite criar um **túnel de porta local**, encaminhando conexões do seu dispositivo iOS para a máquina remota.  
O comando é:

```bash
ssh -L 1455:127.0.0.1:1455 usuario@servidor
```

Explicação dos parâmetros
• -L indica o uso de port forwarding local.
• 1455 (antes dos dois pontos) é a porta local no iOS.
• 127.0.0.1:1455 é o endereço e porta remotos que receberão o tráfego.
• usuario@servidor é o destino SSH.

Com isso, qualquer conexão feita em localhost:1455 no dispositivo local é enviada, de forma criptografada, para localhost:1455 no servidor remoto.

Fluxo completo
1.  No iOS (a-Shell ou outro cliente SSH), conecte-se com redirecionamento de porta:

```
```bash
ssh -L 1455:127.0.0.1:1455 usuario@servidor
```

2.  No servidor remoto, execute:

```bash
codex login
```


3.  O comando exibirá uma URL semelhante a:

https://auth.openai.com/...callback=http://localhost:1455


4.  Copie essa URL e abra no Safari do iOS.
5.  Após a autenticação, o navegador redireciona para http://localhost:1455/....
O túnel SSH envia essa requisição para o servidor remoto, onde o Codex CLI está aguardando o callback.
6.  O CLI recebe o código OIDC e conclui o login com sucesso.

Por que o túnel funciona

O OIDC exige que o cliente (no caso, o Codex CLI) receba um callback HTTP local contendo o código de autenticação.
O túnel SSH (ssh -L) faz o redirecionamento desse callback entre o navegador local e o processo remoto, mantendo o fluxo de autenticação íntegro e seguro, sem necessidade de expor o servidor à internet.

### Diferença entre ssh -L, ssh -R e ssh -D

O SSH permite criar túneis para redirecionar conexões de rede entre o cliente local e o servidor remoto.
Os três modos principais são Local Forwarding (-L), Remote Forwarding (-R) e Dynamic Forwarding (-D).

```bash
ssh -L — Local Port Forwarding
```
```

Encaminha conexões feitas no cliente local para um host/porta no servidor remoto.

Sintaxe:

```bash
ssh -L [porta_local]:[host_remoto]:[porta_remota] usuario@servidor
```

Exemplo:
```bash
ssh -L 1455:127.0.0.1:1455 usuario@servidor
```

Fluxo:
• O cliente (no caso, o iOS) escuta em localhost:1455.
• Qualquer conexão feita nessa porta é enviada via túnel SSH.
• O servidor remoto recebe o tráfego como se fosse local (127.0.0.1:1455).

Uso comum:
Acessar serviços rodando no servidor remoto como se estivessem na máquina local, como no caso do codex login.

```bash
ssh -R — Remote Port Forwarding
```

Encaminha conexões feitas no servidor remoto para um host/porta acessível a partir do cliente local.

Sintaxe:

```bash
ssh -R [porta_remota]:[host_local]:[porta_local] usuario@servidor
```

Exemplo:

```bash
ssh -R 8080:127.0.0.1:80 usuario@servidor
```

Fluxo:
• O servidor remoto escuta em localhost:8080.
• Conexões feitas nessa porta são encaminhadas para 127.0.0.1:80 no cliente local.

Uso comum:
Permitir que o servidor remoto acesse um serviço hospedado na máquina local (por exemplo, um servidor de desenvolvimento em um laptop).

```bash
ssh -D — Dynamic Port Forwarding (SOCKS Proxy)
```

Cria um proxy SOCKS local que pode encaminhar tráfego para qualquer destino, de forma dinâmica.

Sintaxe:

```bash
ssh -D [porta_local] usuario@servidor
```

Exemplo:

```bash
ssh -D 1080 usuario@servidor
```

Fluxo:
• O cliente escuta em localhost:1080.
• Aplicações configuradas para usar esse proxy (como navegadores) enviam tráfego por ele.
• O SSH redireciona as conexões para os destinos através do servidor remoto.

Uso comum:
Navegar na internet com tráfego roteado por um servidor remoto (proxy seguro via SSH).

Resumo Comparativo

Opção  Origem da Conexão Destino do Redirecionamento  Função Principal
-L  Cliente local Servidor remoto Encaminhar tráfego local para o servidor
-R Servidor remoto Cliente local Encaminhar tráfego remoto para o cliente
-D  Cliente local Dinâmico (via SOCKS)  Proxy flexível por SSH
