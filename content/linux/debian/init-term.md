---
title: Debian 12 init 
type: docs
weight: 9
---

### Como Configurar o Zsh com Powerlevel10k, Autosuggestions e Syntax Highlighting no Debian 12

Neste artigo, vou mostrar como configurar o terminal Zsh no Debian 12, com o tema **Powerlevel10k**, o plugin **zsh-autosuggestions** e o **zsh-syntax-highlighting**, para criar um ambiente de terminal mais poderoso e eficiente.

#### Passo 1: Instalar o Zsh
O primeiro passo é instalar o Zsh, que é um shell de comando poderoso. Abra o terminal e execute os seguintes comandos:

```bash
sudo apt update
sudo apt upgrade
sudo apt install zsh
```

Com isso, o Zsh estará instalado no seu sistema.

#### Passo 2: Alterar o Shell Padrão
Para tornar o Zsh o seu shell padrão, execute o seguinte comando:

```bash
chsh -s $(which zsh)
```

Depois disso, saia da sua sessão atual e entre novamente ou reinicie o terminal.

#### Passo 3: Instalar o Oh My Zsh
O **Oh My Zsh** é um framework de configuração para o Zsh que facilita a personalização e o uso de plugins. Para instalá-lo, execute o seguinte comando:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Isso instalará o Oh My Zsh e o configurará automaticamente.

#### Passo 4: Instalar o Powerlevel10k
O **Powerlevel10k** é um tema visual para o Zsh que oferece uma aparência moderna e altamente configurável. Para instalá-lo, execute os seguintes comandos:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
```

Agora, edite o arquivo de configuração do Zsh (`~/.zshrc`) para usar o Powerlevel10k:

```bash
vim ~/.zshrc
```

Altere a linha que define o tema para:

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
```

Em seguida, execute o comando:

```bash
source ~/.zshrc
```

#### Passo 5: Instalar o zsh-autosuggestions
O **zsh-autosuggestions** é um plugin que sugere comandos automaticamente com base no seu histórico enquanto você digita. Para instalá-lo, execute os seguintes comandos:

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Edite novamente o arquivo `~/.zshrc` e adicione o plugin à lista de plugins:

```bash
vim ~/.zshrc
```

Encontre a linha que define os plugins (geralmente `plugins=(git)`) e adicione o `zsh-autosuggestions` à lista:

```bash
plugins=(git zsh-autosuggestions)
```

Depois, execute o comando para aplicar as mudanças:

```bash
source ~/.zshrc
```

#### Passo 6: Instalar o zsh-syntax-highlighting
O **zsh-syntax-highlighting** adiciona realce de sintaxe no terminal, tornando os comandos mais fáceis de entender. Para instalá-lo, execute os seguintes comandos:

```bash
sudo apt install zsh-syntax-highlighting
echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ${ZDOTDIR:-$HOME}/.zshrc
```

Por fim, execute:

```bash
source ~/.zshrc
```
