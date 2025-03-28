---
title: Debian 12 nvim
type: docs
weight: 10
---

### Como Instalar o Neovim 0.8 ou Superior no Debian 12 Usando Compilação Manual

Este artigo descreve como instalar o **Neovim 0.8 ou superior** no **Debian 12**, usando a compilação manual para garantir que você obtenha a versão mais recente do Neovim.

#### Passo 1: Instalar o Neovim (Versão Padrão do Debian)

Primeiro, a versão padrão do Neovim foi instalada a partir dos repositórios do Debian, embora essa versão possa ser inferior à 0.8:

```bash
sudo apt install neovim
```

#### Passo 2: Preparar o Ambiente para a Compilação

O processo de compilação do Neovim foi iniciado, incluindo o download do código-fonte diretamente do repositório do Neovim no GitHub:

```bash
git clone https://github.com/neovim/neovim
cd neovim
```

Depois de clonar o repositório, foi necessário compilar o Neovim, utilizando o CMake, com o comando abaixo:

```bash
make CMAKE_BUILD_TYPE=RelWithDebInfo
```

#### Passo 3: Instalar o CMake

Caso o **CMake** ainda não tenha sido instalado, ele foi instalado com o comando:

```bash
sudo apt install cmake
```

Esse passo é necessário para garantir que o processo de compilação aconteça sem erros.

#### Passo 4: Gerar o Pacote `.deb`

Após a compilação, o pacote `.deb` foi gerado com o comando:

```bash
cd build && cpack -G DEB
```

#### Passo 5: Remover a Versão Antiga do Neovim

Antes de instalar o pacote `.deb` gerado, qualquer versão antiga do Neovim foi removida com os seguintes comandos:

```bash
sudo apt remove neovim
sudo apt autoremove
```

Isso garante que não haja conflitos de versão.

#### Passo 6: Instalar o Pacote `.deb`

Em seguida, o pacote `.deb` foi instalado usando o `dpkg`:

```bash
sudo dpkg -i nvim-linux-x86_64.deb
```

#### Passo 7: Verificar a Versão Instalado

Após a instalação, foi importante verificar se a versão correta do Neovim foi instalada:

```bash
nvim --version
```

Esse comando mostrou se o Neovim foi instalado corretamente, e a versão deve ser 0.8 ou superior.

#### Passo 8: Adicionar Sua Configuração Personalizada do LazyVim

1. **Clone o repositório com suas configurações do LazyVim**:

Se você tem seu repositório de configurações do LazyVim no GitHub (ou outro local), clone-o no diretório de configuração do Neovim:

```bash
git clone https://github.com/fguisso/lazyvim-config.git ~/.config/nvim
```
#### Passo 9: Usar o Neovim

Agora com a versão correta instalada, o Neovim pode ser iniciado normalmente com:

```bash
nvim
```
