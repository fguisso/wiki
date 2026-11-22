---
title: Migração Paperless-ngx
type: docs
---

##  Migração Paperless-ngx entre containers no Proxmox (Debian 11 → Paperless v2.12.1)

Este é o passo a passo que usei para migrar meus dados do Paperless-ngx, mantendo a versão v2.12.1, de um container antigo para um novo, sem usar Docker.

## Entrar e sair dos containers

```bash
pct enter <ct_id>
```
## Etapa 1: Verificando espaço no container antigo

Entrar no container antigo e executar os seguintes comandos.

Antes de começar a exportação, verifiquei o espaço usado pelas pastas principais:

```bash
du -sh /opt/paperless/media /opt/paperless/data
```

E também quanto de espaço livre havia disponível:

```bash
df -h /
```

Como havia espaço suficiente, segui sem aumentar o disco.

## Etapa 2: Exportando os dados

Entrei na pasta do projeto e rodei o `document_exporter` indicando um diretório, como é exigido na versão v2.12.1:

```bash
mkdir /opt/paperless/src/export
python3 manage.py document_exporter /opt/paperless/src/export
```

O comando gerou os arquivos diretamente dentro da pasta `export/`, incluindo `manifest.json` e todos os PDFs e arquivos `.webp` no mesmo nível.

## Etapa 3: Compactando os arquivos de exportação

Para facilitar a transferência, compacte o conteúdo da pasta (e não a pasta em si):

```bash
cd /opt/paperless/src/export
tar -czf /tmp/paperless-export.tar.gz *
```

## Etapa 4: Transferindo o export para o host do Proxmox

No host Proxmox, copiei o arquivo `.tar.gz` do container antigo para o host:

```bash
pct pull <ct_id_antigo> /tmp/paperless-export.tar.gz /root/paperless-export.tar.gz
```

## Etapa 5: Criando o novo container com Paperless atualizado

No shell do Proxmox, usei o script oficial para instalar um novo container:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/paperless-ngx.sh)"
```

## Etapa 6: Transferindo o export para o novo container

Ainda no host, enviei o arquivo para o novo container:

```bash
pct push <ct_id_novo> /root/paperless-export.tar.gz /tmp/paperless-export.tar.gz
```

## Etapa 7: Verificando ou definindo a senha do banco

Entrar no container novo e executar os seguintes comandos.

No novo container, verifiquei a senha gerada automaticamente no arquivo:

```bash
cat /opt/paperless/paperless.conf
```

Se necessário, eu poderia ter alterado a senha diretamente no PostgreSQL e atualizado esse mesmo arquivo com a nova senha:

```bash
sudo -u postgres psql -c "ALTER USER paperless WITH PASSWORD 'nova_senha';"
nano /opt/paperless/paperless.conf
```

## Etapa 8: Limpando o banco no novo container

Como o banco novo já tinha dados (usuário padrão criado automaticamente), precisei apagá-lo para garantir uma importação limpa:

```bash
sudo -u postgres dropdb paperlessdb
sudo -u postgres createdb paperlessdb
sudo -u postgres psql -c "ALTER USER paperless WITH PASSWORD 'nova_senha';"
```

## Etapa 9: Corrigindo permissões do banco

Dentro do psql:

```sql
\c paperlessdb
ALTER SCHEMA public OWNER TO paperless;
GRANT USAGE, CREATE ON SCHEMA public TO paperless;
GRANT ALL PRIVILEGES ON DATABASE paperlessdb TO paperless;
\q
```

## Etapa 10: Aplicando as migrations

Exportei as variáveis de ambiente antes de rodar as migrations:

```bash
export PAPERLESS_DBUSER=paperless
export PAPERLESS_DBPASS=nova_senha
export PAPERLESS_DBNAME=paperlessdb
export PAPERLESS_DBHOST=127.0.0.1

cd /opt/paperless-ngx/src
python3 manage.py migrate
```

## Etapa 11: Importando os dados

Importei os dados a partir do `.tar.gz`:

```bash
python3 manage.py document_importer /tmp/paperless-export.tar.gz
```

## Etapa 12: Indexação dos documentos

Para reconstruir os índices e OCR:

```bash
python3 manage.py document_indexer
```

## Etapa 14: Iniciando os serviços

Como estou usando systemd, ativei e iniciei os serviços:

```bash
systemctl daemon-reexec
systemctl daemon-reload

systemctl start paperless-webserver
systemctl start paperless-consumer
systemctl start paperless-scheduler

systemctl enable paperless-webserver
systemctl enable paperless-consumer
systemctl enable paperless-scheduler
```

## Resultado

O Paperless-ngx foi migrado com sucesso para um novo container com os dados intactos e estrutura funcional, mantendo compatibilidade com a versão 2.12.1 e pronta para futuros upgrades.
