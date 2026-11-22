---
title: PVE install
type: docs
weight: 11
---

## Rede Local Organizada (2025)

Pré-requisitos
	•	Proxmox VE recém-instalado
	•	UniFi Express 7 como gateway
	•	Rede configurada em 10.0.0.0/24
	•	Acesso ao painel UniFi (unifi.ui.com)
	•	Helper-scripts do tteck disponíveis:

https://helper-scripts.com

### Instalação nova do Proxmox VE (PVE)

Após instalar o Proxmox, valide:
	•	Interface de rede correta
	•	Máscara e gateway
	•	Hostname e DNS
	•	Acesso ao painel:

https://IP_DO_PVE:8006

#### Garantir IP correto e acesso ao dashboard

Verifique o IP:

```
ip a
```

O dashboard web deve estar acessível sem reconfiguração manual.

#### Configurar SSH, authorized_keys e mosh

1. Configurar acesso por chave SSH

No seu computador:

```bash
ssh-copy-id root@10.0.0.10
```

Ou manualmente no PVE:

```bash
mkdir -p ~/.ssh
vi ~/.ssh/authorized_keys
```

Cole sua chave pública.

2. Instalar mosh

```bash
apt install mosh -y
```

Mosh mantém sessões estáveis em redes instáveis.

#### Rodar o PVE Post Install (helper-scripts)

O script realiza ajustes importantes:
	•	Remove repositório enterprise
	•	Adiciona repositório no-subscription
	•	Configura APT
	•	Otimiza o sistema
	•	Adiciona ferramentas úteis

Execute:

```bash
bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/install/post-install.sh)"
```

Reinicie o PVE se solicitado.

#### Por que precisamos de DNS externo

O UniFi Express 7 não fornece:
	•	DNS interno
	•	Host overrides
	•	DNS rewrite
	•	DHCP Option 6
	•	Redirecionamento de DNS

Portanto, precisamos de um servidor DNS dedicado para:
	•	Logs de DNS
	•	Filtro de anúncios
	•	Domínios internos
	•	Wildcards
	•	Integração com Nginx Proxy Manager

O AdGuard Home é a escolha ideal.

#### Instalar o AdGuard Home via helper-scripts

No PVE:

bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/adguard.sh)"

Defina um IP fixo, por exemplo:

10.0.0.16

Acesse:

http://10.0.0.16:3000

Realize as configurações iniciais e ative listas de bloqueio conforme sua preferência.

#### Configurar o UniFi Express 7 para usar o AdGuard

No painel UniFi:

Settings → Networks → Default → DHCP Server
	1.	Desmarque o item:
Auto DNS Server
	2.	Os campos manuais de DNS aparecerão. Configure:

DNS Server 1: 10.0.0.16
DNS Server 2: 1.1.1.1

Salve as alterações.

Agora toda a rede usa o AdGuard como DNS primário, com fallback seguro.

#### Criar DNS rewrites no AdGuard

Exemplo de wildcard para servidores internos usando o domínio .local:

No AdGuard:
	1.	Acesse: Filters
	2.	Seção: DNS rewrites
	3.	Adicione:

Domain: *.pve.local
IP: 10.0.0.20

Justificativa: .local é reconhecido por navegadores como domínio interno, resolvendo o seu dominio no lugar de buscar a palavra em buscadores default.

#### Instalar o Nginx Proxy Manager

No PVE:

bash -c "$(wget -qLO - https://github.com/tteck/Proxmox/raw/main/ct/nginxproxymanager.sh)"

Escolha um IP fixo, por exemplo:

10.0.0.20

Acesse:

http://10.0.0.20:81

Crie seu usuário e senha iniciais.

#### Criar hosts internos no NPM

Com o DNS funcionando via AdGuard, você pode expor os serviços internos assim:

1. Painel do AdGuard

adguard.pve.local → http://10.0.0.166:3000

2. Painel do NPM

nginx.pve.local → http://10.0.0.20:81

Agora acesso aos serviços internos fica amigável:

https://adguard.pve.local
https://nginx.pve.local

#### Expandir o homelab com novos serviços

Para qualquer novo container ou VM:
	1.	Instale o serviço
	2.	Crie o o host no Nginx Proxy Manager

ha.pve.local → http://10.0.0.50:8123


A partir disso, qualquer serviço interno pode ser acessado por nome.
