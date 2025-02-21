---
title: VM Debian 12 
type: docs
---

Sempre seguir os passos iniciais mais atualizados do helper scripts:

- [Debian 12 VM](https://community-scripts.github.io/ProxmoxVE/scripts?id=debian-vm)

Depois precisamos de uma config minima:

Primeiro crie uma senha para o root:

```bash
passwd root
```

Antes de fazer um `apt update` e `apt upgrade` é bom aumentar o disco, para isso você precisa aumentar o disk nas configurações das VM pelo Proxmox. Mesmo depois disso, você vai precisar expandir o particionamento para os valores novos que você acabou de setar.

Dentro da VM instale o `parted`

```bash
apt install parted
```

Depois siga os passos:
```bash
$ parted /dev/sda

resizepart 1
Fix/Ignore? Fix
Partition number? 1
Yes/No? Yes
End? [2146MB]? -0
(parted) quit
(reboot if not going further)
```

### Adicione um Guest Agent do PVE

```bash
apt install qemu-guest-agent
```

## 1. Instalar o Servidor SSH

### a) Atualize os pacotes
Abra o terminal e execute:
```bash
sudo apt update
```

### b) Instale o OpenSSH Server
Execute o comando:
```bash
sudo apt install openssh-server
```

### c) Verifique se o serviço está ativo
Após a instalação, verifique o status do serviço:
```bash
sudo systemctl status ssh
```
Você deverá ver uma mensagem indicando que o serviço está "active (running)".

## 2. Configurar o SSH para Autenticação por Chave

### a) Gerar a chave SSH (no seu computador local)
Se ainda não possui uma chave SSH, no seu terminal local, gere-a com:
```bash
ssh-keygen -t ed25519
```
Caso prefira RSA (com 4096 bits):
```bash
ssh-keygen -t rsa -b 4096
```
Siga as instruções e salve a chave no diretório padrão (geralmente `~/.ssh/id_ed25519` ou `~/.ssh/id_rsa`).

### b) Copiar a chave pública para o servidor Debian
Utilize o comando abaixo, substituindo `usuario` pelo nome de usuário no Debian e `IP_DO_SERVIDOR` pelo endereço IP do servidor:
```bash
ssh-copy-id usuario@IP_DO_SERVIDOR
```
Esse comando adiciona sua chave pública ao arquivo `~/.ssh/authorized_keys` do usuário remoto.

### c) Ajustar a configuração do SSH (opcional)
No servidor, edite o arquivo de configuração:
```bash
sudo nano /etc/ssh/sshd_config
```
Verifique (ou adicione) as seguintes linhas para reforçar a autenticação por chave:

```plaintext
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no
```

>Atenção: Certifique-se de que a chave pública foi copiada corretamente e o acesso via chave está funcionando antes de desabilitar a autenticação por senha.

### d) Reinicie o serviço SSH para aplicar as mudanças
```bash
sudo systemctl restart ssh
```

## 3. Testando a Configuração

1. **Conexão via chave:**  
   No seu computador local, conecte-se usando o comando:
   ```bash
   ssh -vvv usuario@IP_DO_SERVIDOR
   ```
   O parâmetro `-vvv` mostra detalhes da conexão, ajudando a diagnosticar qualquer problema.

2. **Verifique os logs (se necessário):**  
   Caso haja falhas, acesse os logs no servidor:
   ```bash
   sudo tail -n 50 /var/log/auth.log
   ```
   Analise as mensagens para identificar eventuais erros de autenticação ou permissão.
