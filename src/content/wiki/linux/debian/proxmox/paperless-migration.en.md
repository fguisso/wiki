---
title: Paperless-ngx Migration
type: docs
---

This is the step-by-step guide I used to migrate my Paperless-ngx data, maintaining version v2.12.1, from an old container to a new one, without using Docker.

## Entering and exiting containers

```bash
pct enter <ct_id>
```

## Step 1: Checking disk space on the old container

Enter the old container and run the following commands.

Before starting the export, I checked the space used by the main folders:

```bash
du -sh /opt/paperless/media /opt/paperless/data
```

And also how much free space was available:

```bash
df -h /
```

Since there was enough space, I proceeded without increasing the disk size.

## Step 2: Exporting the data

I entered the project folder and ran the `document_exporter`, pointing to a directory as required in version v2.12.1:

```bash
mkdir /opt/paperless/src/export
python3 manage.py document_exporter /opt/paperless/src/export
```

The command generated files directly inside the `export/` folder, including `manifest.json` and all `.pdf` and `.webp` files at the same level.

## Step 3: Compressing the exported files

To make the transfer easier, I compressed the **contents** of the folder (not the folder itself):

```bash
cd /opt/paperless/src/export
tar -czf /tmp/paperless-export.tar.gz *
```

## Step 4: Transferring the export to the Proxmox host

On the Proxmox host, I copied the `.tar.gz` file from the old container to the host:

```bash
pct pull <old_ct_id> /tmp/paperless-export.tar.gz /root/paperless-export.tar.gz
```

## Step 5: Creating the new container with updated Paperless

On the Proxmox shell, I used the official script to install a new container:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/community-scripts/ProxmoxVE/main/ct/paperless-ngx.sh)"
```

## Step 6: Transferring the export to the new container

Still on the host, I pushed the export file to the new container:

```bash
pct push <new_ct_id> /root/paperless-export.tar.gz /tmp/paperless-export.tar.gz
```

## Step 7: Checking or setting the database password

Enter the new container and run the following commands.

In the new container, I checked the auto-generated password from:

```bash
cat /opt/paperless/paperless.conf
```

If needed, I could have changed the password directly in PostgreSQL and updated this same file:

```bash
sudo -u postgres psql -c "ALTER USER paperless WITH PASSWORD 'new_password';"
nano /opt/paperless/paperless.conf
```

## Step 8: Resetting the database in the new container

Since the new database already had data (default user created automatically), I dropped and recreated it to ensure a clean import:

```bash
sudo -u postgres dropdb paperlessdb
sudo -u postgres createdb paperlessdb
sudo -u postgres psql -c "ALTER USER paperless WITH PASSWORD 'new_password';"
```

## Step 9: Fixing database permissions

Inside `psql`:

```sql
\c paperlessdb
ALTER SCHEMA public OWNER TO paperless;
GRANT USAGE, CREATE ON SCHEMA public TO paperless;
GRANT ALL PRIVILEGES ON DATABASE paperlessdb TO paperless;
\q
```

## Step 10: Applying migrations

I exported the environment variables before running the migrations:

```bash
export PAPERLESS_DBUSER=paperless
export PAPERLESS_DBPASS=new_password
export PAPERLESS_DBNAME=paperlessdb
export PAPERLESS_DBHOST=127.0.0.1

cd /opt/paperless-ngx/src
python3 manage.py migrate
```

## Step 11: Importing the data

I imported the data from the `.tar.gz` file:

```bash
python3 manage.py document_importer /tmp/paperless-export.tar.gz
```

## Step 12: Indexing documents

To rebuild the search index and OCR:

```bash
python3 manage.py document_indexer
```

## Step 14: Starting the services

Since I'm using systemd, I enabled and started the services:

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

## Result

Paperless-ngx was successfully migrated to a new container with all data intact and a functional structure, maintaining compatibility with version 2.12.1 and ready for future upgrades.
