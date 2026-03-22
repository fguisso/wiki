---
title: Claude Code no Homelab
type: docs
date: 2026-03-22
description: Usar Claude Code com CLAUDE.md, skills e documentação para gerenciar Proxmox, Unifi e serviços locais via API
---

Rodar o Claude Code diretamente no shell do nó Proxmox, com um repositório de documentação como contexto, transforma o assistente em algo que entende o ambiente antes de agir.

## Estrutura

```
/home/claude-mox/
├── CLAUDE.md              # contexto principal — carregado automaticamente
├── docs/
│   ├── inventory.md       # containers: VMID, IP, recursos, função
│   ├── network.md         # DNS, proxy, certificados, APIs
│   └── storage.md         # ZFS pools, datasets, bind mounts
├── alerts/
│   └── current.md         # problemas ativos — consultado antes de agir
└── .claude/
    └── commands/          # slash commands do projeto
        └── unifi.md       # /unifi — consulta e gestão da rede
```

## CLAUDE.md

Define o ambiente para o assistente. O Claude Code carrega automaticamente em cada sessão.

```markdown
## Ambiente
- Nó: pve — Proxmox VE 9.x
- IP do Host: 192.168.1.10/24

## CLIs Disponíveis
| Comando | Uso                         |
|---------|-----------------------------|
| pvesh   | API REST do Proxmox via CLI  |
| pct     | Gerenciar containers LXC    |
| zpool   | Gerenciar pools ZFS         |

## Fluxo de Trabalho
1. Verificar alerts/current.md antes de qualquer mudança
2. Consultar docs/inventory.md para entender impacto
3. Documentar resultados após mudanças
```

## Skills (.claude/commands/)

Cada arquivo `.md` em `.claude/commands/` vira um slash command disponível na sessão.

Exemplo — `.claude/commands/unifi.md`:

```markdown
# Unifi — Consulta e gestão da rede

1. Autenticar na API do Unifi com a API Key
2. Buscar clientes ativos e reservas DHCP
3. Autenticar no NPM e buscar proxy hosts
4. Cruzar as fontes e reportar:
   - Containers no proxy sem IP fixo no Unifi
   - IPs divergentes do documentado
5. Sugerir correções
```

Invocar com `/unifi` executa toda essa lógica sem re-explicar contexto.

---

## APIs úteis

### Proxmox

```bash
pvesh get /cluster/resources --output-format json
pct exec <vmid> -- bash -c "comando"
```

### UniFi (REST)

```bash
# clientes ativos
curl -sk https://192.168.1.1/proxy/network/api/s/default/stat/sta \
  -H "X-API-KEY: <token>"

# reservas DHCP
curl -sk https://192.168.1.1/proxy/network/api/s/default/rest/user \
  -H "X-API-KEY: <token>"

# configurar DNS do DHCP em uma rede
curl -sk -X PUT \
  https://192.168.1.1/proxy/network/api/s/default/rest/networkconf/<id> \
  -H "X-API-KEY: <token>" \
  -H "Content-Type: application/json" \
  -d '{"dhcpd_dns_enabled": true, "dhcpd_dns_1": "192.168.1.53", "dhcpd_dns_2": "1.1.1.1"}'
```

### Nginx Proxy Manager (REST)

```bash
TOKEN=$(curl -sk -X POST http://192.168.1.20:81/api/tokens \
  -H 'Content-Type: application/json' \
  -d '{"identity":"user@example.com","secret":"senha"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["token"])')

# listar proxy hosts
curl -sk http://192.168.1.20:81/api/nginx/proxy-hosts \
  -H "Authorization: Bearer $TOKEN"

# criar proxy host com SSL
curl -sk -X POST http://192.168.1.20:81/api/nginx/proxy-hosts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domain_names": ["servico.interno.exemplo.dev"],
    "forward_scheme": "http",
    "forward_host": "192.168.1.30",
    "forward_port": 8096,
    "certificate_id": 2,
    "ssl_forced": true,
    "allow_websocket_upgrade": true,
    "enabled": true,
    "meta": {}, "locations": [], "access_list_id": 0,
    "advanced_config": "", "http2_support": false,
    "hsts_enabled": false, "caching_enabled": false
  }'
```

### AdGuard Home (REST)

```bash
# adicionar rewrite DNS
curl -sk -u "user:senha" \
  -X POST http://192.168.1.53/control/rewrite/add \
  -H "Content-Type: application/json" \
  -d '{"domain": "*.interno.exemplo.dev", "answer": "192.168.1.20"}'
```

---

## HTTPS interno com wildcard

Para HTTPS nos domínios internos sem expor serviços individualmente:

1. Use um subdomínio real: `*.interno.seudominio.dev`
2. No NPM, emitir certificado via DNS-01 com token Cloudflare (permissão `Zone → DNS → Edit`)
3. Nenhuma porta precisa estar aberta para a internet
4. Nos CT logs aparece apenas `*.interno.seudominio.dev`

```bash
# emitir cert wildcard via NPM API
curl -sk -X POST http://192.168.1.20:81/api/nginx/certificates \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "letsencrypt",
    "nice_name": "*.interno.seudominio.dev",
    "domain_names": ["*.interno.seudominio.dev", "interno.seudominio.dev"],
    "meta": {
      "dns_challenge": true,
      "dns_provider": "cloudflare",
      "dns_provider_credentials": "dns_cloudflare_api_token = <token-cloudflare>",
      "propagation_seconds": 60
    }
  }'
```

Fluxo completo:

```
AdGuard: *.interno.seudominio.dev → IP do NPM
NPM: cert wildcard + proxy host por serviço
Unifi DHCP: distribui AdGuard como DNS para a rede
```

Qualquer dispositivo que pegar DHCP resolve os domínios internos com HTTPS automaticamente.
