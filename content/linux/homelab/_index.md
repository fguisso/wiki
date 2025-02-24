---
title: Homelab 
type: docs
---

# Guisso Cloud 

De uma olhada no meu artigo para detalhes sobre os assuntos: [Proxmox & Homelab](https://guisso.dev/misc/proxmox-debian-day/)

## Infraestrutura Base

- **Hypervisor**: Proxmox VE
- **Método de Deploy**: [helper-scripts.com](https://helper-scripts.com) para automatizar a criação de containers LXC

## Aplicações em Produção

### Gerenciamento e Rede
- **[AdGuard Home](https://community-scripts.github.io/ProxmoxVE/scripts?id=adguard)**: Servidor DNS com bloqueio de anúncios e rastreadores.
- **[Nginx Proxy Manager](https://community-scripts.github.io/ProxmoxVE/scripts?id=nginxproxymanager)**: Gerenciamento de proxy reverso e certificados SSL.

### Mídia e Downloads
- **[Jellyfin](https://community-scripts.github.io/ProxmoxVE/scripts?id=jellyfin)**: Servidor de mídia para streaming de filmes, séries e músicas.
- **[qBittorrent](https://community-scripts.github.io/ProxmoxVE/scripts?id=qbittorrent)**: Cliente torrent para downloads.
- **[PhotoPrism](https://community-scripts.github.io/ProxmoxVE/scripts?id=photoprism)**: Gerenciamento e organização de fotos com IA.

### Armazenamento e Documentos
- **[Nextcloud](https://community-scripts.github.io/ProxmoxVE/scripts?id=nextcloudpi)**: Nuvem pessoal para arquivos, calendários e contatos.
- **[Paperless-ngx](https://community-scripts.github.io/ProxmoxVE/scripts?id=paperless-ngx)**: Sistema de gerenciamento de documentos digitais.

### Máquinas Virtuais
- **[Debian 12](https://community-scripts.github.io/ProxmoxVE/scripts?id=debian-vm)**: VM para estudos sobre empacotamento no Debian.

## Benefícios desta Estrutura

1. **Centralização**: Todas as aplicações em um único lugar
3. **Isolamento**: Cada serviço em seu próprio container/VM
4. **Facilidade de Manutenção**: Deploy rápido usando helper-scripts

## Próximos Passos

- Implementar sistema de backup automatizado
