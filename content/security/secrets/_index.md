---
title: Validando secrets
type: docs
---
## AWS Secret

Quando você tem um par de credenciais da AWS como `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.

> As chamadas de API da AWS exigem uma assinatura digital no cabeçalho HTTP, o que torna difícil testar diretamente com ferramentas como `curl`. O AWS CLI já faz essa assinatura automaticamente para você, facilitando a validação.

Você pode validar uma secret usando o seguinte comando:

```bash
AWS_ACCESS_KEY_ID=AKIA... \
AWS_SECRET_ACCESS_KEY=abc123... \
aws sts get-caller-identity
````

Se as credenciais forem válidas, você receberá uma resposta semelhante a esta:

```json
{
    "UserId": "AROAEXAMPLEID:bot",
    "Account": "123456789012",
    "Arn": "arn:aws:sts::123456789012:assumed-role/MyRoleName/bot"
}
```

Se as credenciais estiverem inválidas ou expiradas, o CLI exibirá uma mensagem de erro informando o problema.

> 💡 **Dica**: Se você também tiver uma `AWS_SESSION_TOKEN`, adicione-a como variável de ambiente:
>
> ```bash
> AWS_SESSION_TOKEN=... \
> ```

Assim, você consegue validar se a credencial é válida e qual identidade ela representa.

## GitHub Token

Token de acesso pessoal do GitHub (Personal Access Token).

### Validação com `curl` (forma mais simples e rápida)

`curl` com a flag `-i`, que mostra os *headers* da resposta — onde estão os escopos (permissões) do token no cabeçalho `X-OAuth-Scopes`.

```bash
curl -i -H "Authorization: Bearer ghp_seuTokenAqui" https://api.github.com/user
````

Se o token for válido, a resposta incluirá:

* Um corpo com os dados do usuário autenticado.
* Headers HTTP contendo o campo `X-OAuth-Scopes`, por exemplo:

```
HTTP/2 200
...
X-OAuth-Scopes: repo, read:org, user
...
```

### Validação com GitHub CLI (gh)

Se você já tiver o GitHub CLI (`gh`) instalado, também pode usar a variável de ambiente `GH_TOKEN` e rodar:

```bash
GH_TOKEN=ghp_seuTokenAqui gh api -i /user
```
