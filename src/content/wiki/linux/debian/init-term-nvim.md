---
title: Debian 12 nvim
type: docs
weight: 10
---

### Como Instalar o Neovim 0.8 ou Superior no Debian 12 Usando Compilação Manual

#### Instalar o CMake

Caso o **CMake** ainda não tenha sido instalado, use este comando e o `make` tambem e instalado junto:

```bash
sudo apt install cmake
```

Esse passo é necessário para garantir que o processo de compilação aconteça sem erros.

#### Preparar o Ambiente para a Compilação

O processo de compilação do Neovim foi iniciado, incluindo o download do código-fonte diretamente do repositório do Neovim no GitHub:

```bash
git clone https://github.com/neovim/neovim
cd neovim
```

Depois de clonar o repositório, foi necessário compilar o Neovim, utilizando o CMake, com o comando abaixo:

```bash
make CMAKE_BUILD_TYPE=RelWithDebInfo
```

#### Gerar o Pacote `.deb`

Após a compilação, o pacote `.deb` foi gerado com o comando:

```bash
cd build && cpack -G DEB
```

#### Instalar o Pacote `.deb`

Em seguida, o pacote `.deb` foi instalado usando o `dpkg`:

```bash
sudo dpkg -i nvim-linux-x86_64.deb
```

#### Verificar a Versão Instalado

Após a instalação, foi importante verificar se a versão correta do Neovim foi instalada:

```bash
nvim --version
```

Esse comando mostrou se o Neovim foi instalado corretamente, e a versão deve ser 0.8 ou superior.

#### Adicionar Sua Configuração Personalizada do LazyVim

1. **Clone o repositório com suas configurações do LazyVim**:

Se você tem seu repositório de configurações do LazyVim no GitHub (ou outro local), clone-o no diretório de configuração do Neovim:

```bash
git clone https://github.com/fguisso/lazyvim-config.git ~/.config/nvim
```
```
