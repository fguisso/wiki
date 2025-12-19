---
title: Movimentos e notação
type: docs
weight: 1
---

## Peças e orientação

- Centros: não mudam de posição; use-os para definir cores fixas (ex.: branco em cima, verde na frente).
- Arestas: peças com duas cores; no 3x3x3 ficam entre centros.
- Cantos: peças com três cores; mesmos movimentos são usados no 2x2x2.

## Notação básica de giros

- Siglas vêm do inglês: `R` Right (direita), `L` Left (esquerda), `U` Up (cima), `D` Down (baixo), `F` Front (frente), `B` Back (trás).
- Faces (90° horário por padrão):
  - `R` direita ![R](/images/cubo/mov-r.png) `R'` anti-horário ![R'](/images/cubo/mov-rp.png)
  - `L` esquerda ![L](/images/cubo/mov-l.png) `L'` ![L'](/images/cubo/mov-lp.png)
  - `U` topo ![U](/images/cubo/mov-u.png) `U'` ![U'](/images/cubo/mov-up.png)
  - `D` base ![D](/images/cubo/mov-d.png) `D'` ![D'](/images/cubo/mov-dp.png)
  - `F` frente ![F](/images/cubo/mov-f.png) `F'` ![F'](/images/cubo/mov-fp.png)
  - `B` trás (imagine o cubo visto de trás) ![B](/images/cubo/mov-b.png) `B'` ![B'](/images/cubo/mov-bp.png)
- Giro duplo: `2` após a letra (`R2`).
- Camadas amplas: `Rw`, `Uw`, etc. giram duas camadas; `M` (meio vertical), `E` (meio horizontal), `S` (meio frontal).
- Giros do cubo: `x` (como `R` + `L'`), `y` (como `U` + `D'`), `z` (como `F` + `B'`).

## Convenções de manuseio

- Segure sempre com a face da frente apontando para você; mantenha a orientação até concluir a fórmula.
- Não solte peças já montadas; movimentos intermediários podem desmontar, mas o algoritmo as devolve no final.
- Use `U` e `U'` para alinhar casos antes de aplicar a fórmula (especialmente em camadas finais).

## Leituras de algoritmos

```
R U R' U'   # sequência clássica de inserção/extração de canto
U R U' R'   # usada para alinhar uma aresta do meio
F R U R' U' F'   # orienta arestas do topo criando a cruz
```

Cada bloco deve ser executado sem pausar para evitar perder a orientação. Planeje antes de começar: visualize para onde cada peça vai (destino no topo, meio ou base).
