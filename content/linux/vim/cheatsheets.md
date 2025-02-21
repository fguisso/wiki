---
type: docs
title: VIM cheatsheets
---

## 1. Movimentação no Arquivo

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


## 2. Modo Insert e Edição de Texto

- **`A`**  
  Vai para o fim da linha e entra no modo Insert.

- **`"+y`**  
  Copia o conteúdo selecionado para o clipboard do sistema.

- **`:%s/<antigo>/<novo>/gc`**  
  Substitui ocorrências no arquivo:  
  - **`g`**: Substitui todas as ocorrências em cada linha (global).  
  - **`c`**: Solicita confirmação para cada substituição.


## 3. Salvando e Saindo

- **`:wqa`**  
  - **`w`**: Write (salvar).  
  - **`q`**: Quit (sair).  
  - **`a`**: All (todos os buffers/arquivos).  
  Salva todas as alterações e fecha todas as janelas.

- **`:q!`**  
  Sai do nVim sem salvar as alterações.


## 4. Deletar Texto

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


## 5. Indentação

- **`>`**  
  Indenta o texto selecionado (aumenta o recuo).

- **`<`**  
  Desindenta o texto selecionado (diminui o recuo).

- **`==`**  
  Tenta indentar a linha atual automaticamente.


## 6. Seleção de Texto

- **`ggVG`**  
  Seleciona todo o conteúdo do arquivo:  
  - **`gg`**: Vai para o início do arquivo.  
  - **`V`**: Entra no modo Visual Line.  
  - **`G`**: Vai para o fim do arquivo, selecionando tudo.


## 7. Conversão de Texto

- **`U`**  
  Converte o texto selecionado para **maiúsculas**.

- **`u`**  
  Converte o texto selecionado para **minúsculas**.


## 8. Macros

- **`qX`**  
  Inicia a gravação de uma macro, onde `X` é a tecla à qual a macro será atribuída.

- **`q`**  
  Para a gravação da macro.

- **`@X`**  
  Executa (reproduz) a macro associada à tecla `X`.

- **`@@`**  
  Repete a última macro executada.


## 9. Navegação em Telas Divididas (Splits)

No Vim (incluindo nVim), para navegar entre splits, utilize:

- **`CTRL + w + j`**  
  Move para a tela inferior.

- **`CTRL + w + k`**  
  Move para a tela superior.

- **`CTRL + w + h`**  
  Move para a tela à esquerda.

- **`CTRL + w + l`**  
  Move para a tela à direita.


## 10. Operações Adicionais

- **`y p`**  
  - **`y`**: Yank (copiar).  
  - **`p`**: Paste (colar).  
  Copia o conteúdo e cola no local desejado.

- **`ci"`**  
  Apaga o conteúdo entre aspas e entra no modo Insert para substituir o texto.


## 11. Abrir Arquivos em Splits

- **`:vsp nome_do_arquivo`**  
  Abre um novo arquivo em uma divisão vertical.

- **`:sp nome_do_arquivo`**  
  Abre um novo arquivo em uma divisão horizontal.


## 12. Outras Operações

- **`u`**  
  Desfaz a última alteração (undo).

- **`CTRL + r`**  
  Refaz a última alteração desfeita (redo).
