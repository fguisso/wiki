---
title: Multisig
type: docs
---

# Criando o endereço

`createmultisig M '["keyN"]'`
Onde M é o total de keys necessarias para assinar a tx e N é o numero total de keys. Usa-se o scriptPubKey, que você pode conseguir dando o comando `validateaddress <address>`, assim as partes não precisam da privkey, garantindo a privacidade de cada um.

ex:
```
  createmultisig 2
  '["034d43e1271139ec736f8f0ecb1777968e342b219e02c7888f547d9108f2733cfe",
    "0216b988bf22709a09030832d8e3d8f4fdfbb353a466696085bdadaccc6a668e3c",
    "033b0352cccd149e73aa29780c2fe646470d114594449f24bbcb9704f1a250ee3f"]'
  ```

Feito isso você já tem um endereço multi assinado para usar, agora sempre que quiser usar os bitcoins desse endereço você vai ter que assinar com no minumo duas privkey.
Guarde essas informações, o redeemScript também é necessario para quando você for criar a tx assinada para usar os bitcoins.
```
{
  "address": "38mSgFspgUhHXpw73DuLcs28guFt4qFx9h",
  "redeemScript": "5221034d43e1271139ec736f8f0ecb1777968e342b219e02c7888f547d9108f2733cfe210216b988bf22709a09030832d8e3d8f4fdfbb353a466696085bdadaccc6a668e3c52ae"
}
```

# Usando os bitcoins do endereço multi assinado

Primeiro você vai precisar do txid e scriptPubKey da transação que você tenha mandado bitcoins para o endereço multi assinado.

```
createrawtransaction
'[{"txid":"c05f90c8147aeaa38fbf358aba6b9c0e1b3cf9b5d0b5bf7ae052a926d8981d90",
  "vout":0,
  "scriptPubKey":"76a914ff6979f2fccffa129ef059d8e74910e8638084fd88ac",
  "redeemScript":"5221034d43e1271139ec736f8f0ecb1777968e342b219e02c7888f547d9108f2733cfe210216b988bf22709a09030832d8e3d8f4fdfbb353a466696085bdadaccc6a668e3c52ae"}]'
  '{"1QHVfYVfUsgjykoXSCB6rsPe7T5ssNnQGJ":0.01}'
```

Com a rawtx na mão você já pode assina-la.

`signrawtransaction 0100000001901d98d826a952e07abfb5d0b5f93c1b0e9c6bba8a35bf8fa3ea7a14c8905fc00000000000ffffffff0150c30000000000001976a914ff6979f2fccffa129ef059d8e74910e8638084fd88ac00000000`

Enquanto não receber todas as assinaturas necessarias vc vera uma resposta assim:

```
{
  "hex": "0100000001901d98d826a952e07abfb5d0b5f93c1b0e9c6bba8a35bf8fa3ea7a14c8905fc00000000000ffffffff0150c30000000000001976a914ff6979f2fccffa129ef059d8e74910e8638084fd88ac00000000",
  "complete": false
}
```

Quando o "complete" for igual a true, vc já pode enviar sua sua tx para ela entrar na rede.

`sendrawtransaction`
