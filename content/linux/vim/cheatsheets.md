---
type: docs
title: VIM cheatsheets
---

## Movimentação no Arquivo

- **`h`**  
  Move o cursor para a esquerda.

- **`j`**  
  Move o cursor para baixo.

- **`k`**  
  Move o cursor para cima.

- **`l`**  
  Move o cursor para a direita.

- **`gg`**  
  Leva o cursor para o início do arquivo (topo).

- **`G`**  
  Move o cursor para o fim do arquivo.

- **`0`**  
  Move o cursor para o início da linha.


## Modo Insert e Edição de Texto

- **`A`**  
  Vai para o fim da linha e entra no modo Insert.

- **`cl`**
  - c: change, alteração.
  - l: right.
  Alteração a direita do cursor. Este comando é equivalente ao `s` no vim.

- **`ciw`**
  - c: change, alteração.
  - w: world.
  Alteração da palavra e abre o modo Insert.

<script src="https://asciinema.org/a/BAu8W00QriAID9gvsbE9K3ZrV.js" id="asciicast-BAu8W00QriAID9gvsbE9K3ZrV" async="true"></script> 

- **`"+y`**  
  Copia o conteúdo selecionado para o clipboard do sistema.

- **`:%s/<antigo>/<novo>/gc`**  
  Substitui ocorrências no arquivo:  
  - **`g`**: Substitui todas as ocorrências em cada linha (global).  
  - **`c`**: Solicita confirmação para cada substituição.

<script src="https://asciinema.org/a/0HRGw4n6tHFKo4mnD8PepdmeP.js" id="asciicast-0HRGw4n6tHFKo4mnD8PepdmeP" async="true"></script>

## Salvando e Saindo

- **`:wqa`**  
  - **`w`**: Write (salvar).  
  - **`q`**: Quit (sair).  
  - **`a`**: All (todos os buffers/arquivos).  
  Salva todas as alterações e fecha todas as janelas.

- **`:q!`**  
  Sai do nVim sem salvar as alterações.


## Deletar Texto

- **`x`**  
  Deleta o caractere sob o cursor.

- **`d`**  
  Deleta uma linha inteira ou um movimento definido.

  - **`diw`**  
    Deleta o conteúdo interno de uma palavra (sem remover os espaços externos).

  - **`daw`**  
    Deleta a palavra inteira, incluindo os espaços ao redor.

- **`xp`**  
  Transpõe (troca) os dois caracteres: o de onde o cursor está e o seguinte.


## Indentação

- **`>`**  
  Indenta o texto selecionado (aumenta o recuo).

- **`<`**  
  Desindenta o texto selecionado (diminui o recuo).

- **`==`**  
  Tenta indentar a linha atual automaticamente.


## Seleção de Texto

- **`ggVG`**  
  Seleciona todo o conteúdo do arquivo:  
  - **`gg`**: Vai para o início do arquivo.  
  - **`V`**: Entra no modo Visual Line.  
  - **`G`**: Vai para o fim do arquivo, selecionando tudo.


## Conversão de Texto

- **`U`**  
  Converte o texto selecionado para **maiúsculas**.

- **`u`**  
  Converte o texto selecionado para **minúsculas**.


## Macros

- **`qX`**  
  Inicia a gravação de uma macro, onde `X` é a tecla à qual a macro será atribuída.

- **`q`**  
  Para a gravação da macro.

- **`@X`**  
  Executa (reproduz) a macro associada à tecla `X`.

- **`@@`**  
  Repete a última macro executada.


## Navegação em Telas Divididas (Splits)

No Vim (incluindo nVim), para navegar entre splits, utilize:

- **`CTRL + w + j`**  
  Move para a tela inferior.

- **`CTRL + w + k`**  
  Move para a tela superior.

- **`CTRL + w + h`**  
  Move para a tela à esquerda.

- **`CTRL + w + l`**  
  Move para a tela à direita.


## Operações Adicionais

- **`y p`**  
  - **`y`**: Yank (copiar).  
  - **`p`**: Paste (colar).  
  Copia o conteúdo e cola no local desejado.

- **`ci"`**  
  Apaga o conteúdo entre aspas e entra no modo Insert para substituir o texto.


## Abrir Arquivos em Splits

- **`:vsp nome_do_arquivo`**  
  Abre um novo arquivo em uma divisão vertical.

- **`:sp nome_do_arquivo`**  
  Abre um novo arquivo em uma divisão horizontal.


## Outras Operações

- **`u`**  
  Desfaz a última alteração (undo).

- **`CTRL + r`**  
  Refaz a última alteração desfeita (redo).
